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
} from '../../../services';

@Component({
    standalone: true,
    imports: [
        RouterLink,
    ],
    templateUrl: './order.delete.page.html'
})
export class OrderDeletePage implements AfterViewInit {
    public readonly _noOfFields: number[] = [...Array(3).keys()];

    public id: number | null = null;
    public isLoading: boolean = true;
    public order: OrderResponse | null = null;
    public errorMessage: string = '';
    public isSubmitted: boolean = false;

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

    public async onSubmitClicked(
    ): Promise<void> {
        this.isSubmitted = true;

        try {
            await this._ordersService.delete(this.id!);

            this._router.navigate(
                ['/orders'],
            );
        } catch (error) {
            const err: Error = error as Error;
            this.errorMessage = err.message;
            this.isSubmitted = false;
        }
    }
};