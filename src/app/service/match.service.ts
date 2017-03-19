import { Injectable } from '@angular/core';

import { CommunicationService } from './communication.service';

import { Match } from '../model/match';
import { Game } from '../model/game';
import { EventCallbackError } from '../model/eventCallbackError';

@Injectable()
export class MatchService {
    constructor(private communicationService: CommunicationService) {}

    getMatches(gameKey?:string): Promise<Match[] | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.getList',
            data: {
                gameKey: gameKey
            }
        });
    }

    openMatch(id: number): Promise<Match | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.openMatch',
            data: {
                matchId: id
            }
        });
    }

    closeMatch(): Promise<boolean | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'match.closeMatch'
        })
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