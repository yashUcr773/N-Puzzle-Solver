import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// services
import { AppHelperService } from './services/apphelper.service';

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
        AppRoutingModule
    ],
    providers: [AppHelperService],
    bootstrap: [AppComponent]
})
export class AppModule { }
