import { ChangeDetectorRef, Component } from '@angular/core';
import { links } from 'src/app/constants/links';
import { AppHelperService } from 'src/app/services/apphelper.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {

    social_links = links;
    activeMode: ActiveModes = 'Play';
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


}

type ActiveModes = 'Play' | 'Solve';