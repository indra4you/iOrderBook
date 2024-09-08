import {
    AfterViewInit,
    Component,
} from '@angular/core';
import {
    RouterLink,
} from '@angular/router';

import {
    DataService,
    OrderModel,
    RootModel,
} from '../../../services';

@Component({
    standalone: true,
    imports: [
        RouterLink,
    ],
    templateUrl: './order.list.page.html'
})
export class OrderListPage implements AfterViewInit {
    public readonly _noOfData: number[] = [...Array(3).keys()];

    public isLoading: boolean = false;
    public list: OrderModel[] = [];

    constructor(
        private readonly _dataService: DataService,
    ) {
    }

    public ngAfterViewInit(
    ): void {
        setTimeout(
            () => this.load(),
            500,
        );
    }

    private async load(
    ): Promise<void> {
        this.isLoading = true;

        try {
            const root: RootModel = await this._dataService.getRoot();
            const order: OrderModel[] = root.orders ?? [];

            this.list = order
                .sort(
                    (a, b) => a.name.localeCompare(b.name)
                );
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(
                () => this.isLoading = false,
                500,
            );
        }
    }

    public get hasData(
    ): boolean {
        return this.list.length > 0;
    }
};