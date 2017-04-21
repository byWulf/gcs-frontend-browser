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
    statusSubject:BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(private communicationService: CommunicationService, private cookieService: CookieService) {
        let userSession:any = this.cookieService.getObject('userSession');
        if (userSession) {
            this.loginWithAuthToken(userSession.userId, userSession.authToken);
        }
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
                this.setLoggedinUser(data.user, data.authToken);
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
                this.setLoggedinUser(data.user, data.authToken);
            }
        });
    }

    private setLoggedinUser(user: User, authToken: string): void {
        this.user = user;
        this.userSubject.next(this.user);

        this.cookieService.putObject('userSession', {userId: this.user.id, authToken: authToken});
        this.cookieService.putObject('username', this.user.displayName);
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
                this.setLoggedinUser(data.user, data.authToken);
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

                this.cookieService.remove('userId');
            }
        });
    }
}