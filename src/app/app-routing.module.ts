import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PlayerComponent } from './components/player/player.component';
import { SolverComponent } from './components/solver/solver.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: '', redirectTo: 'Play', pathMatch: 'full' },
            { path: 'Play', component: PlayerComponent },
            { path: 'Solve', component: SolverComponent }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
