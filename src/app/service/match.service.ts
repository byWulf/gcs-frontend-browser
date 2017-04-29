import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { CommunicationService } from './communication.service';

import { Match } from '../model/match';
import { Game } from '../model/game';
import { EventCallbackError } from '../model/eventCallbackError';

@Injectable()
export class MatchService {
    currentMatchSubject:BehaviorSubject<Match> = new BehaviorSubject(null);

    constructor(private communicationService: CommunicationService) {}

    getMatches(gameKey?:string): Promise<Match[] | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.getList',
            data: {
                gameKey: gameKey
            }
        });
    }

    openMatch(id: string): Promise<Match | EventCallbackError> {
        return new Promise(resolve => {
            this.communicationService.sendData({
                action: 'match.openMatch',
                data: {
                    matchId: id
                }
            }).then((match:Match|EventCallbackError) => {
                if (!(match instanceof EventCallbackError)) {
                    this.currentMatchSubject.next(match);
                }

                resolve(match);
            });
        });
    }

    closeMatch(): Promise<boolean | EventCallbackError> {
        return new Promise(resolve => {
            this.communicationService.sendData({
                action: 'match.closeMatch'
            }).then((successful:boolean|EventCallbackError) => {
                if (!(successful instanceof EventCallbackError) && successful === true) {
                    this.currentMatchSubject.next(null);
                }

                resolve(successful);
            });
        });
    }

    createMatch(game:Game): Promise<number | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.create',
            data: {
                gameKey: game.key,
                settings: []
            }
        });
    }

    joinMatch(match:Match, index:number): Promise<boolean | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.join',
            data: {
                matchId: match.id,
                index: index
            }
        })
    }

    switchSlot(match:Match, index:number): Promise<boolean | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.switchSlot',
            data: {
                matchId: match.id,
                index: index
            }
        })
    }

    leaveMatch(match:Match): Promise<boolean | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.leave',
            data: {
                matchId: match.id
            }
        });
    }

    cancelMatch(match:Match): Promise<boolean | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.cancel',
            data: {
                matchId: match.id
            }
        });
    }

    startMatch(match:Match): Promise<boolean | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.start',
            data: {
                matchId: match.id
            }
        });
    }

    callMethod(match:Match, elementId:string, method:string, data:any): Promise<boolean | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.method',
            data: {
                matchId: match.id,
                elementId: elementId,
                method: method,
                data: data
            }
        });
    }
}