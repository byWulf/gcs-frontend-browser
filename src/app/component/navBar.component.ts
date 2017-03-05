import {Component, OnInit} from '@angular/core';

import { UserService } from '../service/user.service';
import { CookieService } from 'angular2-cookie/core';

import { User } from '../model/user';

@Component({
    moduleId: module.id,
    selector: 'my-navbar',
    templateUrl: './navBar.component.html',
    styleUrls: [ './navBar.component.css' ]
})

export class NavBarComponent implements OnInit {
    title = 'Game Central Station';
    user: User;
    cookieUserId:number;

    constructor(private userService:UserService, private cookieService:CookieService) {}

    ngOnInit(): void {
        this.userService.userSubject.subscribe(user => {
            this.user = user;
        });
        this.cookieUserId = <number>this.cookieService.getObject('userId');
    }

    logoutUser() {
        this.userService.logout();
    }

    loginUser() {
        this.userService.login();
    }

    registerUser() {
        this.userService.register();
    }
}