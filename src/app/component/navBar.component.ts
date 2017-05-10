import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

import { UserService } from '../service/user.service';

import { User } from '../model/user';

@Component({
    moduleId: module.id,
    selector: 'my-navbar',
    templateUrl: './navBar.component.html',
    styleUrls: [ './navBar.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class NavBarComponent implements OnInit {
    self = this;

    title: string = 'Game Central Station';
    version: string = '0.0.1-alpha1';

    user: User;
    userStatus:string;

    navbarLayer: string = 'navbar0';
    gameNavbarEnabled: boolean = false;


    private leaveTimeout: NodeJS.Timer = null;

    constructor(private userService:UserService, private router: Router) {}

    ngOnInit(): void {
        this.userService.userSubject.subscribe(user => {
            this.user = user;
        });
        this.userService.statusSubject.subscribe(status => {
            this.userStatus = status;
        });

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (/^\/matches\/\d+/.test(event.url)) {
                    this.gameNavbarEnabled = true;
                    this.switchNavbar(1);
                } else {
                    this.gameNavbarEnabled = false;
                    this.switchNavbar(0);
                }
            }
        });
    }

    logoutUser() {
        this.userService.logout();

        return false;
    }

    switchNavbar(layerIndex: number): boolean {
        this.navbarLayer = 'navbar' + layerIndex;

        return false;
    }

    navbarEntered(): void {
        if (this.leaveTimeout) {
            clearTimeout(this.leaveTimeout);
        }
    }

    navbarLeft(): void {
        this.leaveTimeout = setTimeout(() => {
            if (this.gameNavbarEnabled) {
                this.switchNavbar(1);
            }
        }, 1000);
    }
}