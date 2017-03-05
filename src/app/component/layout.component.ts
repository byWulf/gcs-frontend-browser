import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationEnd, Data} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

@Component({
    moduleId: module.id,
    selector: 'my-layout',
    templateUrl: './layout.component.html',
    styleUrls: [ './layout.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class LayoutComponent implements OnInit {
    fullscreen: boolean = false;

    constructor(
      private route: ActivatedRoute,
      private router: Router
    ) {}

    ngOnInit() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(() => {
                let currentRoute = this.route.root;
                while (currentRoute.children[0] !== undefined) {
                    currentRoute = currentRoute.children[0];
                }

                this.fullscreen = !!currentRoute.snapshot.data['fullscreen'];
            });
    }
}