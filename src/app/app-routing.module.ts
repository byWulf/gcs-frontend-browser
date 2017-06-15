import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./component/dashboard.component";
import {GamesComponent} from "./component/games.component";
import {GameCreateComponent} from "./component/game-create.component";
import {MatchCreateComponent} from "./component/match-create.component";
import {MatchComponent} from "./component/match.component";
import {MatchesComponent} from "./component/matches.component";
import {ImpressumComponent} from "./component/impressum.component";

const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'games', component: GamesComponent},
    {path: 'games/create', component: GameCreateComponent, data: {fullscreen: true}},
    {path: 'matches/create/:key', component: MatchCreateComponent},
    {path: 'matches/list/:key', component: MatchesComponent},
    {path: 'matches/list', component: MatchesComponent},
    {path: 'matches/:id', component: MatchComponent, data: {fullscreen: true}},
    {path: 'matches', redirectTo: 'matches/list', pathMatch: 'full'},
    {path: 'impressum', component: ImpressumComponent}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}