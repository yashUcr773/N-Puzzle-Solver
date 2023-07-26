import { Component, OnInit } from '@angular/core';
import { links } from './constants/links';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    social_links = links;
    constructor() {

    }

    
    ngOnInit(): void {

    }


    launchLink(url: string, newTab = true) {
        let link = document.querySelector('#external_link') as HTMLAnchorElement;
        if (link) {
            if (newTab) {
                link.target = '_blank';
            }
            link.href = url;
            link.click();
        }
    }

}
