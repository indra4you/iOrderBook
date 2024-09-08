import {
    Component,
} from '@angular/core';
import {
    RouterOutlet,
} from '@angular/router';

import {
    FooterComponent,
    NavBarComponent,
} from './components';

@Component({
    standalone: true,
    selector: 'app-root',
    imports: [
        RouterOutlet,
        FooterComponent,
        NavBarComponent,
    ],
    templateUrl: './app.component.html'
})
export class AppComponent {
};