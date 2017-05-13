import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";

import { CommunicationService } from './communication.service';
import { CookieService } from 'ngx-cookie';

import { EventCallbackError } from '../model/eventCallbackError';
import { User } from '../model/user';

@Injectable()
export class UserService {
    user: User = null;
    userSubject:BehaviorSubject<User> = new BehaviorSubject(this.user);
    statusSubject:BehaviorSubject<string> = new BehaviorSubject(null);
    userSession:any = null;
    private subscriptions:Subscription[] = [];

    constructor(private communicationService: CommunicationService, private cookieService: CookieService) {
        this.userSession = this.cookieService.getObject('userSession');

        this.communicationService.connectionSubject.subscribe(status => {
            if (status == 'connect' && this.userSession) {
                this.loginWithAuthToken(this.userSession.userId, this.userSession.authToken);
            }
            if (status != 'connect' && this.user) {
                this.user = null;
                this.userSubject.next(this.user);
            }
        });
    }

    hasRole(role: string): boolean {
        return this.user !== null && this.user.roles.indexOf(role) > -1;
    }

    register(username: string, email: string, password: string, onFieldError:(errors:any) => void): void {
        this.statusSubject.next('registering');
        this.communicationService.sendData({action: 'user.register', data: {
            username: username,
            email: email,
            password: password
        }}).then(data => {
            this.statusSubject.next(null);

            if (data instanceof EventCallbackError) {
                if (data.error == 'register.fieldErrors') {
                    onFieldError(data.description);
                } else {
                    console.log('Could not register: ', data);
                }
            } else {
                this.setLoggedinUser(data);
            }
        });
    }

    login(usernameOrEmail: string, password: string, onError:(error:EventCallbackError) => void): void {
        this.statusSubject.next('loggingIn');
        this.communicationService.sendData({action: 'user.login', data: {
            usernameOrEmail: usernameOrEmail,
            password: password
        }}).then(data => {
            this.statusSubject.next(null);

            if (data instanceof EventCallbackError) {
                onError(data);
            } else {
                this.setLoggedinUser(data);
            }
        });
    }

    private loginWithAuthToken(userId: number, authToken: string): void {
        this.statusSubject.next('loggingIn');
        this.communicationService.sendData({action: 'user.loginByAuthToken', data: {
            userId: userId,
            authToken: authToken
        }}).then(data => {
            this.statusSubject.next(null);

            if (data instanceof EventCallbackError) {
                console.log("Relogin was not successful: ", data);
            } else {
                this.setLoggedinUser(data);
            }
        });
    }

    logout(): void {
        this.statusSubject.next('loggingOut');
        this.communicationService.sendData({action: 'user.logout'}).then(data => {
            this.statusSubject.next(null);

            if (data instanceof EventCallbackError) {
                console.error('Error while loggin out', data);
            } else {
                this.user = null;
                this.userSubject.next(this.user);

                this.cookieService.remove('userSession');


                for (let subscription of this.subscriptions) {
                    subscription.unsubscribe();
                }
            }
        });

    }

    private setLoggedinUser(data: any): void {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }

        this.user = new User();
        this.user.id = data.id;
        this.user.displayName = data.displayName;
        this.user.roles = data.roles;
        this.user.currentMatch = data.currentMatch;

        this.userSubject.next(this.user);

        let currentDate = new Date();
        let cookieDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);

        this.userSession = {userId: this.user.id, authToken: data.authToken};
        this.cookieService.putObject('userSession', this.userSession, {expires: cookieDate});
        this.cookieService.putObject('username', this.user.displayName, {expires: cookieDate});


        this.subscriptions.push(this.communicationService.listen('user.currentMatchChanged').subscribe(data => {
            if (data.id != this.user.id) return;

            this.user.currentMatch = data.data.currentMatch;
        }));
    }
}