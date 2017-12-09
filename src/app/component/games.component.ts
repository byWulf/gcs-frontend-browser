import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'

import { UserService } from '../service/user.service';
import { GameService } from '../service/game.service';

import { Game } from '../model/game';
import { EventCallbackError } from '../model/eventCallbackError';
import { User } from '../model/user';

@Component({
    moduleId: module.id,
    templateUrl: './games.component.html',
    styleUrls: [ './games.component.css' ]
})

export class GamesComponent implements OnInit, OnDestroy {
    games: Game[] = [];
    user: User;
    error: string = null;
    loading: boolean = false;

    private userSub:Subscription;

    constructor(private gameService: GameService, private userService:UserService) {}

    ngOnInit(): void {
        this.userSub = this.userService.userSubject.subscribe(user => {
            this.user = user;
        });
        this.getGames();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    getGames(): void {
        this.error = null;
        this.loading = true;

        this.gameService.getGames().then(data => {
            this.loading = false;

            if (data instanceof EventCallbackError) {
                this.error = 'Konnte Spielliste nicht laden.';
                console.log('this.gameService.getGames', data);
            } else {
                console.log(data);
                this.games = data;
            }
        });
    }

    hasRole(role): boolean {
        return this.user && this.user.roles.indexOf(role) > -1;
    }
}