import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from './app-routing.module';

import {LayoutComponent} from "./component/layout.component";
import {NavBarComponent} from "./component/navBar.component";
import {DashboardComponent} from "./component/dashboard.component";
import {GamesComponent} from "./component/games.component";
import {MatchCreateComponent} from "./component/match-create.component";
import {MatchComponent} from "./component/match.component";
import {MatchesComponent} from "./component/matches.component";
import {UserRegisterComponent} from "./component/user-register.component";
import {UserLoginComponent} from "./component/user-login.component";

import {GameService} from "./service/game.service";
import {MatchService} from "./service/match.service";
import {CommunicationService} from "./service/communication.service";
import {UserService} from "./service/user.service";
import {CookieService} from "angular2-cookie/services/cookies.service";
import {WindowRefService} from "./service/windowRef.service";

import {Angular2AutoScroll} from "angular2-auto-scroll/lib/angular2-auto-scroll.directive";
import {SafeHtmlPipe} from "./pipe/safeHtml.pipe";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        CommonModule
    ],
    declarations: [
        LayoutComponent,
        NavBarComponent,
        DashboardComponent,
        GamesComponent,
        MatchCreateComponent,
        MatchComponent,
        MatchesComponent,
        Angular2AutoScroll,
        SafeHtmlPipe,
        UserRegisterComponent,
        UserLoginComponent
    ],
    providers: [
        GameService,
        MatchService,
        CommunicationService,
        UserService,
        CookieService,
        WindowRefService
    ],
    bootstrap: [LayoutComponent]
})
export class AppModule {
}
