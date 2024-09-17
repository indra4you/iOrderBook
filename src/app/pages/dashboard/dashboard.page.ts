import {
    NgClass,
} from '@angular/common';
import {
    AfterViewInit,
    Component,
} from '@angular/core';

import {
    OrderModel,
    OrderProductResponse,
    OrderResponse,
    OrdersService,
    OrderStatus,
    ProductModel,
    ProductsService,
} from '../../services';

type ProductTable = {
    name: string,
    noOfOrders: number,
    totalQuantity: number,
    totalAmount: number,
}

@Component({
    standalone: true,
    imports: [
        NgClass,
    ],
    templateUrl: './dashboard.page.html'
})
export class DashboardPage implements AfterViewInit {
    public isLoading: boolean = true;
    public products: ProductModel[] = [];
    public orders: OrderResponse[] = [];
    public productsTable: ProductTable[] = [];

    constructor(
        private readonly _productsService: ProductsService,
        private readonly _ordersService: OrdersService,
    ) {
    }

    ngAfterViewInit(
    ): void {
        setTimeout(
            () => {
                this.load();
            },
            500
        );
    }

    private async load(
    ): Promise<void> {
        this.isLoading = true;

        this.products = await this._productsService.getAll();
        this.orders = await this._ordersService.getAll();

        this.productsTable = this.products
            .sort(
                (a: ProductModel, b: ProductModel) => {
                    if (a.sort < b.sort) {
                        return -1;
                    }
                    
                    if (a.sort > b.sort) {
                        return 1;
                    }

                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                        return -1;
                    }
                    
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                        return 1;
                    }

                    return 0;
                },
            )
            .map(
                (product: ProductModel) => {
                    const orders: OrderResponse[] = this.orders
                        .filter(
                            (order: OrderResponse) => order.products
                                .some(
                                    (value: OrderProductResponse) => value.product.id === product.id
                                )
                        );

                    return {
                        name: product.name,
                        noOfOrders: orders.length,
                        totalQuantity: orders.reduce((runningSum, current) => runningSum += current.totalNumberOfPackets, 0),
                        totalAmount: orders.reduce((runningSum, current) => runningSum += current.totalAmount, 0),
                    }
                }
            );

        this.isLoading = false;
    }

    public get hasProducts(
    ): boolean {
        return this.products.length > 0;
    }

    public get hasOrders(
    ): boolean {
        return this.orders.length > 0;
    }

    public get noOfProducts(
    ): number {
        return this.products.length;
    }

    public get noOfOrders(
    ): number {
        return this.orders.length;
    }

    public get noOfSavedOrders(
    ): number {
        return this.orders
            .filter(
                (value: OrderResponse) => value.status === OrderStatus.Saved,
            )
            .length;
    }

    public get noOfDeliveredOrders(
    ): number {
        return this.orders
            .filter(
                (value: OrderResponse) => value.status === OrderStatus.Delivered,
            )
            .length;
    }

    public get noOfProductOrders(
    ): number {
        return this.productsTable
            .reduce(
                (runningSum: number, current: ProductTable) => runningSum += current.noOfOrders,
                0,
            );
    }

    public get totalProductTotalOrderQuantity(
    ): number {
        return this.productsTable
            .reduce(
                (runningSum: number, current: ProductTable) => runningSum += current.totalQuantity,
                0,
            );
    }

    public get totalProductTotalOrderAmount(
    ): number {
        return this.productsTable
            .reduce(
                (runningSum: number, current: ProductTable) => runningSum += current.totalAmount,
                0,
            );
    }

    public getOrderStatusClass(
        orderStatus: OrderStatus,
    ): string {
        switch (orderStatus) {
            case OrderStatus.InProgress:
                return 'border-danger-subtle bg-danger-subtle';
            case OrderStatus.Saved:
                return 'border-primary-subtle bg-primary-subtle';
            case OrderStatus.Delivered:
                return 'border-success-subtle bg-success-subtle';
        }
    }

    public getOrderStatusBorderClass(
        orderStatus: OrderStatus,
    ): string {
        switch (orderStatus) {
            case OrderStatus.InProgress:
                return 'border-danger-subtle';
            case OrderStatus.Saved:
                return 'border-primary-subtle';
            case OrderStatus.Delivered:
                return 'border-success-subtle';
        }
    }
};