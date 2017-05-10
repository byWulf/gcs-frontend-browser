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
    loading: boolean = false;
    error: string = null;

    constructor(
        private matchService: MatchService,
        private gameService: GameService,
        private route: ActivatedRoute
    ) {
}

    ngOnInit(): void {
        this.route.params.switchMap((params: Params) => {
            this.error = null;
            this.loading = true;

            return this.matchService.getMatches(params['key']);
        }).subscribe(data => {
            this.loading = false;

            if (data instanceof EventCallbackError) {
                this.error = 'Fehler beim Laden der Partien.';
                console.log('this.matchService.getMatches', data);
            } else {
                this.matches = data;
            }
        });

        this.gameSub = this.route.params.subscribe(params => {
            if (params['key']) {
                this.error = null;
                this.loading = true;

                this.gameService.getGame(params['key']).then(data => {
                    this.loading = false;

                    if (data instanceof EventCallbackError) {
                        this.error = 'Fehler beim Laden des gefilterten Spiels.';
                        console.log('this.gameService.getGame', data);
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