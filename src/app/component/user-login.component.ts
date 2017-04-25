import {Component, OnInit} from '@angular/core';

import { UserService } from '../service/user.service';
import { CookieService } from 'angular2-cookie/core';

import { User } from '../model/user';
import {EventCallbackError} from "../model/eventCallbackError";

@Component({
    moduleId: module.id,
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls: [ './user-login.component.css' ]
})

export class UserLoginComponent implements OnInit {
    userStatus:string;
    loginUsername:string;
    loginError: boolean = false;

    constructor(private userService:UserService, private cookieService:CookieService) {}

    ngOnInit(): void {
        this.loginUsername = <string>this.cookieService.getObject('username') || '';

        this.userService.userSubject.subscribe(user => {
            if (user) {
                this.loginUsername = user.displayName;
            }
        });
        this.userService.statusSubject.subscribe(status => {
            this.userStatus = status;
        });
    }

    logoutUser() {
        this.userService.logout();
    }

    loginUser() {
        this.loginError = false;
        this.userService.login($('#loginUsername').val(), $('#loginPassword').val(), (error:EventCallbackError) => {
            this.loginError = true;
        });
    }
}