import { Component } from '@angular/core';
import { links } from 'src/app/constants/links';
import { AppHelperService } from 'src/app/services/apphelper.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {

    social_links = links;
    constructor(private appHelperService: AppHelperService) {

    }

    ngOnInit(): void {

    }


    launchLink(url: string) {
        this.appHelperService.launchLink(url)
    }



}