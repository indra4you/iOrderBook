import {
    Component,
    OnInit,
} from '@angular/core';
import {
    RouterLink,
} from '@angular/router';

import {
    OrderModel,
    OrdersService,
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

    public isLoading: boolean = true;
    public orders: OrderModel[] = [];
    public showOrderForm: boolean = false;
    public showOrderDelete: boolean = false;
    public orderEditOrDeleteId: number = 0;

    constructor(
        private readonly _ordersService: OrdersService,
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
        
        this.isLoading = false;
    }

    public get hasOrders(
    ): boolean {
        return this.orders.length > 0;
    }

    public onAddOrderClicked(
    ): boolean {
        this.showOrderForm = true;

        return false;
    }

    public onEditOrderClicked(
        index: number,
    ): void {
        const order: OrderModel = this.orders[index];

        this.orderEditOrDeleteId = order.id;
        this.showOrderForm = true;
    }

    public onOrderFormClose(
    ): void {
        this.orderEditOrDeleteId = 0;
        this.showOrderForm = false;

        this.load();
    }

    public onDeleteOrderClicked(
        index: number,
    ): void {
        const order: OrderModel = this.orders[index];

        this.orderEditOrDeleteId = order.id;
        this.showOrderDelete = true;
    }

    public onOrderDeleteClose(
        deleted: boolean,
    ): void {
        this.showOrderDelete = false;

        if (deleted) {
            this.orderEditOrDeleteId = 0;

            this.load();
        }
    }
};