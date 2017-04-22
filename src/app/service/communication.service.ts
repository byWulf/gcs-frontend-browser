import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import * as io from "socket.io-client";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Event } from '../model/event';
import {EventCallbackError} from "../model/eventCallbackError";

@Injectable()
export class CommunicationService {
    private url = document.location.protocol + '//' + document.location.hostname +  ':3700';
    private socket: any;
    connectionSubject:BehaviorSubject<string> = new BehaviorSubject('connecting');

    private messageId: number = 0;

    constructor() {
        this.socket = io(this.url);

        for (let event of ['connect', 'disconnect', 'reconnecting', 'reconnect_failed']) {
            this.socket.on(event, () => this.connectionSubject.next(event));
        }
    }

    sendData(event: Event): Promise<any> {
        let messageId = this.messageId++;
        this.socket.emit('event', event.action, event.data, messageId);

        return new Promise(resolve => {
            let eventCallback = (data: any) => {
                if (data.messageId === messageId) {
                    resolve(data.data);
                    this.socket.off(eventCallback);
                    this.socket.off(eventErrorCallback);
                }
            };

            let eventErrorCallback = (data: any) => {
                if (data.messageId === messageId) {
                    let eventCallbackError: EventCallbackError = new EventCallbackError();
                    eventCallbackError.error = data.error;
                    eventCallbackError.description = data.description;

                    resolve(eventCallbackError);
                    this.socket.off(eventCallback);
                    this.socket.off(eventErrorCallback);
                }
            };

            this.socket.on('eventCallback', eventCallback);
            this.socket.on('eventErrorCallback', eventErrorCallback);
        });
    }

    listen(action: string): Observable<any> {
        return new Observable((observer:Observer<any>) => {
            this.socket.on(action, (data: any) => {
                observer.next(data);
            });
        });
    }
}