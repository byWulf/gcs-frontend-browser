import {NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from './app-routing.module';

import {LayoutComponent} from "./component/layout.component";
import {NavBarComponent} from "./component/navBar.component";
import {DashboardComponent} from "./component/dashboard.component";
import {GamesComponent} from "./component/games.component";
import {GameCreateComponent} from "./component/game-create.component";
import {MatchCreateComponent} from "./component/match-create.component";
import {MatchComponent} from "./component/match.component";
import {MatchNavbarComponent} from "./component/match-navbar.component";
import {MatchesComponent} from "./component/matches.component";
import {UserRegisterComponent} from "./component/user-register.component";
import {UserLoginComponent} from "./component/user-login.component";
import {ConnectionStatusComponent} from "./component/connection-status.component";
import {ImpressumComponent} from "./component/impressum.component";

import {GameService} from "./service/game.service";
import {MatchService} from "./service/match.service";
import {NotifyService} from "./service/notify.service";
import {CommunicationService} from "./service/communication.service";
import {UserService} from "./service/user.service";
import {WindowRefService} from "./service/windowRef.service";

import {Angular2AutoScroll} from "angular2-auto-scroll/lib/angular2-auto-scroll.directive";
import {SafeHtmlPipe} from "./pipe/safeHtml.pipe";
import {SafeStylePipe} from "./pipe/safeStyle.pipe";
import { CookieModule } from 'ngx-cookie';
import { TagInputModule } from 'ng2-tag-input';
import {RecursiveTreeComponent} from "./component/game-create/recursiveTree.component";
import {ForObjectPipe} from "./pipe/forObjectPipe";
import {AceEditorDirective} from "ng2-ace-editor";


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        CommonModule,
        CookieModule.forRoot(),
        TagInputModule,

    ],
    declarations: [
        LayoutComponent,
        NavBarComponent,
        DashboardComponent,
        GamesComponent,
        GameCreateComponent,
        MatchCreateComponent,
        MatchComponent,
        MatchNavbarComponent,
        MatchesComponent,
        Angular2AutoScroll,
        AceEditorDirective,
        SafeHtmlPipe,
        SafeStylePipe,
        ForObjectPipe,
        UserRegisterComponent,
        UserLoginComponent,
        ConnectionStatusComponent,
        ImpressumComponent,

        RecursiveTreeComponent
    ],
    providers: [
        GameService,
        MatchService,
        NotifyService,
        CommunicationService,
        UserService,
        WindowRefService
    ],
    bootstrap: [LayoutComponent]
})
export class AppModule {
}
