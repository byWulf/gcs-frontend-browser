import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { MatchService } from '../service/match.service';
import { GameService } from '../service/game.service';

import { Match } from '../model/match';
import { Game } from '../model/game';
import { EventCallbackError } from '../model/eventCallbackError';

@Component({
    moduleId: module.id,
    templateUrl: './matches.component.html',
    styleUrls: [ './matches.component.css' ]
})

export class MatchesComponent implements OnInit, OnDestroy {
    private gameSub: Subscription;
    filterGame: Game;
    matches: Match[] = [];

    constructor(
        private matchService: MatchService,
        private gameService: GameService,
        private route: ActivatedRoute
    ) {
}

    ngOnInit(): void {
        this.route.params.switchMap((params: Params) => this.matchService.getMatches(params['key'])).subscribe(data => {

            if (data instanceof EventCallbackError) {
                console.error('Error while fetching matches list: ', data);
            } else {
                this.matches = data;
            }
        });

        this.gameSub = this.route.params.subscribe(params => {
            if (params['key']) {
                this.gameService.getGame(params['key']).then(data => {
                    if (data instanceof EventCallbackError) {
                        console.error('Error while fetching game: ', data);
                    } else {
                        this.filterGame = data;
                    }
                });
            } else {
                this.filterGame = null;
            }
        });
    }

    ngOnDestroy(): void {
        this.gameSub.unsubscribe();
    }
}