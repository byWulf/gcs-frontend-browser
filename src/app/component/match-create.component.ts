import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription'

import {Game} from '../model/game';
import { EventCallbackError } from '../model/eventCallbackError';
import { User } from '../model/user';

import { UserService } from '../service/user.service';
import {GameService} from '../service/game.service';
import {MatchService} from '../service/match.service';

@Component({
    moduleId: module.id,
    selector: 'my-game-create',
    templateUrl: './match-create.component.html',
    styleUrls: [ './match-create.component.css' ]
})

export class MatchCreateComponent implements OnInit, OnDestroy {
    game: Game;
    user: User;

    private userSub:Subscription;

    constructor(
        private gameService: GameService,
        private matchService: MatchService,
        private route: ActivatedRoute,
        private router: Router,
        private userService:UserService
    ) {}

    ngOnInit(): void {
        this.route.params.switchMap((params: Params) => this.gameService.getGame(params['key']))
            .subscribe(data => {
                if (data instanceof EventCallbackError) {
                    console.error('Error while fetching game: ', data);
                } else {
                    this.game = data
                }
            });

        this.userSub = this.userService.userSubject.subscribe(user => {
            this.user = user;

            if (user === null) {
                this.router.navigate(['/games']);
            }
        });
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    create(): void {
        this.matchService.createMatch(this.game).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while creating match: ', data);
            } else {
                this.router.navigate(['/matches', data])
            }
        });
    }
}