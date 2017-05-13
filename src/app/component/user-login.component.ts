import {Component, OnInit, AfterViewInit } from '@angular/core';

import { UserService } from '../service/user.service';
import { CookieService } from 'ngx-cookie';

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
                $('#loginModal')['modal']('hide');
                this.loginUsername = user.displayName;
            }
        });
        this.userService.statusSubject.subscribe(status => {
            this.userStatus = status;
        });
    }

    ngAfterViewInit(): void {
        $('#loginModal').on('hidden.bs.modal', () => {
            $('#loginPassword').val('');
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