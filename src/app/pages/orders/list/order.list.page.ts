import {
    Component,
    OnInit,
} from '@angular/core';
import {
    RouterLink,
} from '@angular/router';

import {
    OrderResponse,
    OrdersService,
    ProductModel,
    ProductsService,
} from '../../../services';

@Component({
    standalone: true,
    imports: [
        RouterLink,
    ],
    templateUrl: './order.list.page.html'
})
export class OrderListPage implements OnInit {
    public readonly _noOfFields: number[] = [...Array(3).keys()];

    public hasProducts: boolean = true;
    public isLoading: boolean = true;
    public orders: OrderResponse[] = [];

    constructor(
        private readonly _ordersService: OrdersService,
        private readonly _productsService: ProductsService,
    ) {
    }

    ngOnInit(
    ): void {
        setTimeout(
            () => this.load(),
            500
        );
    }

    private async load(
    ): Promise<void> {
        this.isLoading = true;

        this.orders = await this._ordersService.getAll();
        if (!this.hasOrders) {
            const products: ProductModel[] = await this._productsService.getAll();
            this.hasProducts = products.length > 0;
        }
        
        this.isLoading = false;
    }

    public get hasOrders(
    ): boolean {
        return this.orders.length > 0;
    }
};