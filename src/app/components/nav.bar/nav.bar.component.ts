import {
    Component,
} from '@angular/core';
import {
    Router,
    RouterLink,
    RouterLinkActive,
} from '@angular/router';

import {
    DataService,
} from '../../services';

@Component({
    standalone: true,
    selector: 'nav-bar',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './nav.bar.component.html'
})
export class NavBarComponent {
    constructor(
        private readonly _dataService: DataService,
        private readonly _router: Router,
    ) {
    }

    public get fileName(
    ): string {
        return this._dataService.name ?? '( In Memory )';
    }

    public async saveClicked(
    ): Promise<void> {
        const result: boolean = await this._dataService.create();
        if (result) {
            await this._dataService.saveAsRoot();
        }
    }

    public async openClicked(
    ): Promise<void> {
        if (this._dataService.isDirty) {
            const response: boolean = confirm('Looks like there are Products and/or Orders in the "Memory" which will be gone once if you open an existing file.\n\nAre you sure you still want to open the file?');
            if (!response) {
                return;
            }
        }

        const result: boolean = await this._dataService.open();
        if (result) {
            this._router.navigate(
                ['/'],
            );
        }
    }

    public get hasFileHandle(
    ): boolean {
        return this._dataService.hasHandle;
    }

    public closeClicked(
    ): void {
        if (!this.hasFileHandle) {
            return;
        }

        this._dataService.close();

        this._router.navigate(
            ['/'],
        );
    }
};