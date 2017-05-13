import {Component, OnInit, Input, ViewEncapsulation, trigger, transition, state, style, animate } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

import { UserService } from '../service/user.service';

import { User } from '../model/user';

@Component({
    moduleId: module.id,
    selector: 'my-navbar',
    templateUrl: './navBar.component.html',
    styleUrls: [ './navBar.component.css' ],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger(
            'changeLayer', [
                state('navbar0', style({top: '0px'})),
                state('navbar1', style({top: '-62px'})),
                state('navbar2', style({top: '-124px'})),
                state('navbar3', style({top: '-186px'})),
                state('navbar4', style({top: '-248px'})),
                transition('* => *', animate('500ms ease-in-out'))
            ]
        )
    ]
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