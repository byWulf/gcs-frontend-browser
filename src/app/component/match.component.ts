import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import * as TinyColor from 'tinycolor2';

import {Match, MatchState} from '../model/match';
import {User} from '../model/user';
import { EventCallbackError } from '../model/eventCallbackError';
import { Visualization } from '../model/match/visualization';

import {MatchService} from '../service/match.service';
import {UserService} from '../service/user.service';
import {CommunicationService} from '../service/communication.service';
import {MatchVisualizationService} from '../service/matchVisualization.service';

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

    private userSub:Subscription;
    private updateSub:Subscription;

    MatchState = MatchState;
    TinyColor = TinyColor;

    visualization:Visualization;

    constructor(
        private matchService: MatchService,
        private route: ActivatedRoute,
        private userService: UserService,
        private communicationService: CommunicationService,
        private matchVisualizationService: MatchVisualizationService
    ) {}

    ngOnInit(): void {
        this.route.params.switchMap((params: Params) => this.matchService.openMatch(params['id']))
            .subscribe(data => {
                if (data instanceof EventCallbackError) {
                    console.error('Error while opening match: ', data);
                    this.match = null;
                } else {
                    this.match = data;
                }
            });

        this.userSub = this.userService.userSubject.subscribe(user => {
            this.user = user;
        });

        this.updateSub = this.communicationService.listen('match.update').subscribe(data => {
            if (!this.match) return;

            if (data.key === 'slots') {
                this.match.slots = data.data;
            }

            if (data.key == 'state') {
                this.match.state = data.data
            }

            if (data.key == 'event') {
                this.handleGameEvent(data.data);
            }
        });

    }

    ngAfterViewInit(): void {
        this.visualization = this.matchVisualizationService.createWorld(this.sceneContainerRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.matchVisualizationService.destroyWorld(this.visualization);

        this.matchService.closeMatch().then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while closing match: ', data);
            }
        });

        this.userSub.unsubscribe();
        this.updateSub.unsubscribe();
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

    private handleGameEvent(data: any): void {
        //console.log("got event from game", data);

        if (data.event == 'element.added') {
            this.matchVisualizationService.addElement(this.visualization, data.id, data.type, data.parent, data.element);
        }

        if (data.event == 'element.moved') {
            this.matchVisualizationService.moveElement(this.visualization, data.id, data.parent);
        }

        if (data.event == 'element.removed') {
            this.matchVisualizationService.removeElement(this.visualization, data.id);
        }
    }
}