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

    user: User = null;

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
                this.handleOpenedMatch(data);
            });

        this.subscriptions.push(this.userService.userSubject.subscribe(user => {
            let oldUser:User = this.user;
            this.user = user;

            if (this.match && user !== oldUser) {
                this.matchService.openMatch(this.match.id).then(data => {
                    this.handleOpenedMatch(data);
                });
            }
        }));

        this.subscriptions.push(this.communicationService.listen('match.update').subscribe(data => {
            if (!this.match) return;

            if (data.key === 'slots') {
                this.match.slots = data.data;

                this.visualization.handleSlotEvent(data.data, this.user);
            } else if (data.key == 'state') {
                this.match.state = data.data
            } else if (data.key == 'event') {
                if (data.data.event == 'progress.changed') {
                    this.match.progress = data.data.progress;
                } else if (data.data.event == 'statusMessage.changed') {
                    this.match.statusMessage = data.data.text;
                } else if (data.data.event == 'notification.added') {
                    this.match.notifications.push(data.data);
                }

                this.visualization.handleGameEvent(data.data.event, data.data);
            } else {
                console.log("unknown 'match.update' event: " + data.key, data.data);
            }
        }));
    }

    private handleOpenedMatch(match:EventCallbackError|Match): void {
        if (match instanceof EventCallbackError) {
            console.error('Error while opening match: ', match);
            this.match = null;
        } else {
            this.match = match;

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
                    }, this.match.slots, this.user);

                    this.visualization.handleSlotEvent(this.match.slots, this.user);

                    //First add all elements to the visualization
                    for (let element of match.elements) {
                        this.visualization.handleGameEvent('element.added', element);
                    }

                    //Then explicitly move them to the correct parent (it could be, that at adding an element, its parent isn't created yet and so is no valid parent target)
                    for (let element of match.elements) {
                        this.visualization.handleGameEvent('element.moved', element);
                    }
                }
            });
        }
    }

    ngAfterViewInit(): void {
        this.visualizationReady.next(true);
    }

    ngOnDestroy(): void {
        if (this.visualization) {
            this.visualization.destroy();
            this.visualization = null;
        }

        this.matchService.closeMatch();

        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    isLoggedIn(): boolean {
        return !!this.user;
    }

    isMe(userId:string): boolean {
        return this.user && userId === this.user.id;
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

    formatTime(time:number): string {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;

        return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }
}