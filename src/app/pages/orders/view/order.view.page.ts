import {
    NgClass,
} from '@angular/common';
import {
    AfterViewInit,
    Component,
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
    RouterLink,
} from '@angular/router';

import {
    OrderProductResponse,
    OrderResponse,
    OrdersService,
    OrderStatus,
} from '../../../services';

@Component({
    standalone: true,
    imports: [
        RouterLink,
        NgClass,
    ],
    templateUrl: './order.view.page.html'
})
export class OrderViewPage implements AfterViewInit {
    public readonly _noOfFields: number[] = [...Array(3).keys()];

    public id: number | null = null;
    public isLoading: boolean = true;
    public order: OrderResponse | null = null;
    public errorMessage: string = '';

    constructor(
        private readonly _ordersService: OrdersService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
    ) {
    }

    ngAfterViewInit(
    ): void {
        setTimeout(
            () => {
                this.isLoading = true;

                this._activatedRoute.paramMap
                    .subscribe({
                        next: params => {
                            if (params.has('id')) {
                                const id: string | null = params.get('id');
                                if (id === null) {
                                    this.id = null;

                                    return;
                                }

                                this.id = +id!;

                                this.load();
                            }
                        }
                    });
            },
            500,
        );
    }

    private async load(
    ): Promise<void> {
        this.isLoading = true;

        try {
            this.order = await this._ordersService.getById(this.id!);

            this.isLoading = false;
        } catch (error) {
            this._router.navigate(
                ['/orders'],
            );
        }
    }

    public get hasValidId(
    ): boolean {
        return this.id !== null && this.id > 0;
    }

    public get hasError(
    ): boolean {
        return this.errorMessage.length > 0;
    }

    public get totalNumberOfPackets(
    ): number {
        return this.order!.products
            .reduce(
                (runningSum: number, current: OrderProductResponse) => runningSum += current.numberOfPackets,
                0
            );
    }

    public get totalAmount(
    ): number {
        return this.order!.products
            .reduce(
                (runningSum: number, current: OrderProductResponse) => runningSum += current.amount,
                0
            );
    }

    public getOrderStatusText(
        orderStatus: OrderStatus,
    ): string {
        return OrderStatus.toString(orderStatus);
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
};