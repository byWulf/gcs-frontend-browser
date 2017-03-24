import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import * as TinyColor from 'tinycolor2';

import {Match, MatchState} from '../model/match';
import {User} from '../model/user';
import { EventCallbackError } from '../model/eventCallbackError';

import {MatchService} from '../service/match.service';
import {UserService} from '../service/user.service';
import {CommunicationService} from '../service/communication.service';
import {WindowRefService} from "../service/windowRef.service";

import {Visualization} from 'gcs-frontend-browser-matchvisualization-3d';

declare const $:JQueryStatic;

@Component({
    moduleId: module.id,
    selector: 'my-match',
    templateUrl: './match.component.html',
    styleUrls: [ './match.component.css' ]
})

export class MatchComponent implements OnInit, OnDestroy {
    @ViewChild('sceneContainer') sceneContainerRef: ElementRef;

    match: Match = null;

    user: User;

    private subscriptions:Subscription[] = [];

    MatchState = MatchState;
    TinyColor = TinyColor;

    visualization:Visualization;
    visualizationReady:BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private matchService: MatchService,
        private route: ActivatedRoute,
        private userService: UserService,
        private communicationService: CommunicationService,
        private windowRef: WindowRefService
    ) {}

    ngOnInit(): void {
        this.visualizationReady.next(false);

        this.route.params.switchMap((params: Params) => this.matchService.openMatch(params['id']))
            .subscribe(data => {
                if (data instanceof EventCallbackError) {
                    console.error('Error while opening match: ', data);
                    this.match = null;
                } else {
                    this.match = data;

                    if (this.visualization) {
                        this.visualization.destroy();
                        this.visualization = null;
                    }

                    this.visualizationReady.subscribe(ready => {
                        if (ready) {
                            this.visualization = new Visualization(this.windowRef.nativeWindow, this.sceneContainerRef.nativeElement, this.match.game.key, (methodName: string, elementId: string, data: any): void => {
                                this.matchService.callMethod(this.match, elementId, methodName, data).then(data => {
                                    if (data instanceof EventCallbackError) {
                                        console.error('Error while calling method "' + methodName + '": ', data);
                                    }
                                });
                            });

                            //First add all elements to the visualization
                            for (let element of data.elements) {
                                this.visualization.handleGameEvent('element.added', element);
                            }

                            //Then explicitly move them to the correct parent (it could be, that at adding an element, its parent isn't created yet and so is no valid parent target)
                            for (let element of data.elements) {
                                this.visualization.handleGameEvent('element.moved', element);
                            }
                        }
                    });
                }
            });

        this.subscriptions.push(this.userService.userSubject.subscribe(user => {
            this.user = user;
        }));

        this.subscriptions.push(this.communicationService.listen('match.update').subscribe(data => {
            if (!this.match) return;

            if (data.key === 'slots') {
                this.match.slots = data.data;
            } else if (data.key == 'state') {
                this.match.state = data.data
            } else if (data.key == 'event') {
                this.visualization.handleGameEvent(data.data.event, data.data);
            } else {
                console.log("unknown 'match.update' event: " + data.key, data.data);
            }
        }));
    }

    ngAfterViewInit(): void {
        this.visualizationReady.next(true);
    }

    ngOnDestroy(): void {
        this.visualization.destroy();
        this.visualization = null;

        this.matchService.closeMatch().then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while closing match: ', data);
            }
        });

        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    isLoggedIn(): boolean {
        return this.user && this.user.id > 0;
    }

    isMe(user:User): boolean {
        return user && user.id === this.user.id;
    }

    isJoined(): boolean {
        for (let slot of this.match.slots) {
            if (slot.user !== null && slot.user.id === this.user.id) {
                return true;
            }
        }

        return false;
    }

    join(index:number) {
        this.matchService.joinMatch(this.match, index).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while joining match: ', data);
            }
        });
    }

    leave() {
        this.matchService.leaveMatch(this.match).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while leaving match: ', data);
            }
        });
    }

    cancel() {
        this.matchService.cancelMatch(this.match).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while canceling match: ', data);
            }
        });
    }

    start() {
        this.matchService.startMatch(this.match).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while starting match: ', data);
            }
        });
    }

    switchSlot(index:number) {
        this.matchService.switchSlot(this.match, index).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while switching slot: ', data);
            }
        });
    }

    lightenColor(color: string): string {
        return TinyColor(color).brighten(80).desaturate(20).toString();
    }

    getSlots() {
        if (this.match.state == MatchState.open) {
            return this.match.slots;
        }

        let slots = {};

        for (let i = 0; i < this.match.slots.length; i++) {
            if (this.match.slots[i].user !== null) {
                slots[i] = this.match.slots[i];
            }
        }
        return slots;
    }
}