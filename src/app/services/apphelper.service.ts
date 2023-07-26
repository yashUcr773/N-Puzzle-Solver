import { Injectable } from '@angular/core'

@Injectable()
export class AppHelperService {

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