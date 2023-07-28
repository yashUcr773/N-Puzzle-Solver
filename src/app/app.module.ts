import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// services
import { AppHelperService } from './services/apphelper.service';
import { BoardHelperService } from './services/board-helper.service';
import { NPuzzleSolverService } from './services/n-puzzle-solver.service';

// sub components
import { BoardComponent } from './components/board/board.component';
import { SolverComponent } from './components/solver/solver.component';
import { PlayerComponent } from './components/player/player.component';
import { MainComponent } from './components/main/main.component';

@NgModule({
    declarations: [
        AppComponent,
        BoardComponent,
        SolverComponent,
        PlayerComponent,
        MainComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [AppHelperService,
        BoardHelperService,
        NPuzzleSolverService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
