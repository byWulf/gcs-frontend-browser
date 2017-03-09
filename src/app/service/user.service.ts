import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { CommunicationService } from './communication.service';
import { CookieService } from 'angular2-cookie/core';

import { EventCallbackError } from '../model/eventCallbackError';
import { User } from '../model/user';

@Injectable()
export class UserService {
    user: User;
    userSubject:BehaviorSubject<User> = new BehaviorSubject(this.user);

    constructor(private communicationService: CommunicationService, private cookieService: CookieService) {
        this.init();
    }

    private init(): void {
        /*if (this.cookieService.getObject('userId')) {
            this.communicationService.sendData({action: 'user.login', data: this.cookieService.getObject('userId')}).then(data => {
                if (data instanceof EventCallbackError) {
                    console.error('Error while logging in', data);
                } else {
                    this.user = data;
                    this.userSubject.next(this.user);
                }
            });
        } else {
            this.communicationService.sendData({action: 'user.register'}).then(data => {
                if (data instanceof EventCallbackError) {
                    console.error('Error while registering', data);
                } else {
                    this.user = data;
                    this.userSubject.next(this.user);

                    this.cookieService.putObject('userId', this.user.id);
                }
            });
        }*/

        this.communicationService.listen('user.ownDetails').subscribe(data => {
            this.user = data;
            this.userSubject.next(this.user);
        });
    }

    register(): void {
        this.communicationService.sendData({action: 'user.register'}).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while registering', data);
            } else {
                this.user = data;
                this.userSubject.next(this.user);

                this.cookieService.putObject('userId', this.user.id);
            }
        });
    }

    login(): void {
        if (!this.cookieService.getObject('userId')) throw new Error('user.noAccount');

        this.communicationService.sendData({action: 'user.login', data: this.cookieService.getObject('userId')}).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while registering', data);
            } else {
                this.user = data;
                this.userSubject.next(this.user);
            }
        });
    }

    logout(): void {
        if (!this.user || this.user.id == 0) throw new Error('user.notLoggedin');

        this.communicationService.sendData({action: 'user.logout'}).then(data => {
            if (data instanceof EventCallbackError) {
                console.error('Error while registering', data);
            } else {
                this.user = data;
                this.userSubject.next(this.user);
            }
        });
    }
}