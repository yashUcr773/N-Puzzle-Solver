import { ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { links } from 'src/app/constants/links';
import { AppHelperService } from 'src/app/services/apphelper.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    social_links = links;
    activeMode: ActiveModes = 'Play';

    moveToSolverEvent = new EventEmitter<any>();

    constructor(private appHelperService: AppHelperService,
        private ref: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        let LSObject: any = JSON.parse(localStorage.getItem('preferences') || "{}");
        if (LSObject == undefined) {
            LSObject = {};
        } else if (LSObject.defaultMode != undefined) {
            this.activeMode = LSObject.defaultMode;
        } else {
            LSObject.defaultMode = this.activeMode;
            localStorage.setItem('preferences', JSON.stringify(LSObject));
        }
        this.ref.detectChanges();

    }


    launchLink(url: string) {
        this.appHelperService.launchLink(url);
    }

    setActiveMode(mode: ActiveModes) {
        this.activeMode = mode;

        let LSObject: any = JSON.parse(localStorage.getItem('preferences') || "{}");
        if (LSObject == undefined) {
            LSObject = {};
        }
        LSObject.defaultMode = mode;
        localStorage.setItem('preferences', JSON.stringify(LSObject));

        this.ref.detectChanges();
    }

    movePuzzleToSolverEvent(event: any) {
        this.setActiveMode('Solve');
        this.ref.detectChanges();
        setTimeout(() => {

            this.moveToSolverEvent.emit(event);
        })
    }


}

type ActiveModes = 'Play' | 'Solve';