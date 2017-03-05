import { Injectable, OnInit } from '@angular/core';

import { CommunicationService } from './communication.service';

import { Game } from '../model/game';
import { EventCallbackError } from '../model/eventCallbackError';

@Injectable()
export class GameService {
    constructor(private communicationService: CommunicationService) {}

    getGames(): Promise<Game[] | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'game.getList'
        });
    }

    getGame(key: string): Promise<Game | EventCallbackError> {
        return this.communicationService.sendData({
            action: 'game.getByKey',
            data: {
                key: key
            }
        });
    }
}