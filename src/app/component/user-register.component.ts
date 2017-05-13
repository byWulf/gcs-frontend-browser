import {Component, OnInit } from '@angular/core';

import { UserService } from '../service/user.service';

@Component({
    moduleId: module.id,
    selector: 'user-register',
    templateUrl: './user-register.component.html',
    styleUrls: [ './user-register.component.css' ]
})

export class UserRegisterComponent implements OnInit {
    userStatus:string;
    registerErrors:any = {
        username: null,
        email: null,
        email2: null,
        password: null,
        password2: null
    };

    constructor(private userService:UserService) {}

    ngOnInit(): void {
        this.userService.userSubject.subscribe(user => {
            if (user) {
                $('#registerModal')['modal']('hide');
            }
        });

        this.userService.statusSubject.subscribe(status => {
            this.userStatus = status;
        });
    }

    ngAfterViewInit(): void {
        $('#registerModal').on('hidden.bs.modal', () => {
            $('#registerUsername').val('');
            $('#registerEmail').val('');
            $('#registerEmail2').val('');
            $('#registerPassword').val('');
            $('#registerPassword2').val('');
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