import {Component, OnInit, Input} from '@angular/core';

import { NavBarComponent } from './navBar.component';

import { UserService } from '../service/user.service';
import { MatchService } from '../service/match.service';
import { NotifyService } from '../service/notify.service';

import {Match, MatchState} from '../model/match';
import { User } from '../model/user';
import {EventCallbackError} from "../model/eventCallbackError";

@Component({
    moduleId: module.id,
    selector: 'matchNavbar',
    templateUrl: './match-navbar.component.html',
    styleUrls: [ './match-navbar.component.css' ]
})

export class MatchNavbarComponent implements OnInit {
    @Input() parentComponent: NavBarComponent;

    user: User;

    MatchState = MatchState;
    currentMatch: Match = null;

    constructor(private userService:UserService, private matchService:MatchService, private notifyService:NotifyService) {}

    ngOnInit(): void {
        this.userService.userSubject.subscribe(user => {
            this.user = user;
        });

        this.matchService.currentMatchSubject.subscribe(match => {
            this.currentMatch = match;
        });
    }

    cancelMatch() {
        this.matchService.cancelMatch(this.currentMatch).then(data => {
            if (data instanceof EventCallbackError) {
                this.notifyService.notify('danger', 'Die Partie konnte wegen eines unerwarteten Fehlers nicht abgebrochen werden.');
                console.error('this.matchService.cancelMatch', data);
            }
        });
    }

    startMatch() {
        this.matchService.startMatch(this.currentMatch).then(data => {
            if (data instanceof EventCallbackError) {
                this.notifyService.notify('danger', 'Die Partie konnte wegen eines unerwarteten Fehlers nicht gestartet werden.');
                console.error('this.matchService.startMatch', data);
            }
        });
    }

    isLoggedIn(): boolean {
        return !!this.user;
    }

    isMe(userId:string): boolean {
        return this.user && userId === this.user.id;
    }
}