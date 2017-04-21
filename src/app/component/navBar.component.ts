import {Component, OnInit} from '@angular/core';

import { UserService } from '../service/user.service';
import { CookieService } from 'angular2-cookie/core';

import { User } from '../model/user';
import {EventCallbackError} from "../model/eventCallbackError";

@Component({
    moduleId: module.id,
    selector: 'my-navbar',
    templateUrl: './navBar.component.html',
    styleUrls: [ './navBar.component.css' ]
})

export class NavBarComponent implements OnInit {
    title = 'Game Central Station';
    user: User;
    userStatus:string;
    loginUsername:string;
    loginError: boolean = false;
    registerErrors:any = {
        username: null,
        email: null,
        email2: null,
        password: null,
        password2: null
    };

    constructor(private userService:UserService, private cookieService:CookieService) {}

    ngOnInit(): void {
        this.loginUsername = <string>this.cookieService.getObject('username');

        this.userService.userSubject.subscribe(user => {
            this.user = user;
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

    registerUser() {
        this.registerErrors = {
            username: null,
            email: null,
            email2: null,
            password: null,
            password2: null
        };

        let errorsFound = false;

        if ($('#registerEmail').val() !== $('#registerEmail2').val()) {
            this.registerErrors.email2 = 'Email stimmt nicht überein.';
            errorsFound = true;
        }

        if ($('#registerPassword').val() !== $('#registerPassword2').val()) {
            this.registerErrors.password2 = 'Passwort stimmt nicht überein.';
            errorsFound = true;
        }

        if (!errorsFound) {
            this.userService.register($('#registerUsername').val(), $('#registerEmail').val(), $('#registerPassword').val(), (errors:any):void => {
                for (let error of errors) {
                    this.registerErrors[error.field] = error.description;
                }
            });
        }
    }
}