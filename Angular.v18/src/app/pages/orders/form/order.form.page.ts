import {
    NgClass,
} from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    ActivatedRoute,
    Router,
    RouterLink,
} from '@angular/router';

import {
    OrderProductFormComponent,
} from '../components';
import {
    OrderProductResponse,
    OrderRequest,
    OrderResponse,
    OrdersService,
    OrderStatus,
} from '../../../services';
import {
    toTrim,
} from '../../../string';

@Component({
    standalone: true,
    imports: [
        RouterLink,
        ReactiveFormsModule,
        NgClass,
        OrderProductFormComponent,
    ],
    templateUrl: './order.form.page.html'
})
export class OrderFormPage implements AfterViewInit {
    public readonly _noOfFields: number[] = [...Array(3).keys()];

    @Input('id')
    public id: number | null = null;

    @ViewChild('focusOn')
    public focusOn: ElementRef<HTMLInputElement> | undefined;

    public isLoading: boolean = true;
    public mainFormGroup: FormGroup;
    public orderProductList: OrderProductResponse[] = [];
    public errorMessage: string = '';
    public showOrderProductForm: boolean = false;
    public addOrEditOrderProduct: OrderProductResponse | null = null;
    public isSubmitted: boolean = false;

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _ordersService: OrdersService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
    ) {
        this.mainFormGroup = this._formBuilder.group({});
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
                                if (id !== null) {
                                    this.id = +id;
                                }
                            }
        
                            this.setupFormGroup();
                        }
                    });
            },
            500,
        );
    }

    private async setupFormGroup(
    ): Promise<void> {
        const order: OrderResponse = await this.load();

        this.mainFormGroup = this._formBuilder.group({
            name: new FormControl(order.name, [Validators.required, Validators.minLength(3)]),
            mobileNumber: new FormControl(order.mobileNumber, [Validators.required, Validators.min(1000000000), Validators.maxLength(9999999999)]),
        });

        this.orderProductList = order.products;

        this.isLoading = false;

        setTimeout(
            () => {
                this.focusOn?.nativeElement.focus();
            },
            500,
        );
    }

    private async load(
    ): Promise<OrderResponse> {
        if (this.hasValidId) {
            try {
                const order: OrderResponse = await this._ordersService.getById(this.id!);

                return order;
            } catch (error) {
                this._router.navigate(
                    ['/orders'],
                );
            }
        }

        return {
            id: -1,
            status: OrderStatus.InProgress,
            name: '',
            mobileNumber: '',
            products: [],
            totalNumberOfPackets: 0,
            totalAmount: 0,
        };
    }

    public get hasValidId(
    ): boolean {
        return this.id !== null && this.id > 0;
    }

    public get hasOrderProducts(
    ): boolean {
        return this.orderProductList.length > 0;
    }

    public get hasError(
    ): boolean {
        return this.errorMessage.length > 0;
    }

    public get isFormValid(
    ): boolean {
        return this.mainFormGroup.valid && this.hasOrderProducts;
    }

    public get totalNumberOfPackets(
    ): number {
        return this.orderProductList
            .reduce(
                (runningSum: number, current: OrderProductResponse) => runningSum += current.numberOfPackets,
                0
            );
    }

    public get totalAmount(
    ): number {
        return this.orderProductList
            .reduce(
                (runningSum: number, current: OrderProductResponse) => runningSum += current.amount,
                0
            );
    }

    public get mainFormGroupControls(
    ): { [key: string]: AbstractControl } {
        return this.mainFormGroup.controls;
    }

    public onAddProductClicked(
    ): boolean {
        this.addOrEditOrderProduct = null;
        this.showOrderProductForm = true;

        return false;
    }

    public onAddOrEditProductClosed(
        orderProduct: OrderProductResponse | null,
    ): void {
        if (orderProduct !== null) {
            if (this.addOrEditOrderProduct === null) {
                this.orderProductList.push(orderProduct);
            } else {
                const index: number = this.orderProductList
                    .findIndex(
                        (value) => value.product.id === this.addOrEditOrderProduct!.product.id
                    );
                this.orderProductList[index] = orderProduct;
            }
        }

        this.addOrEditOrderProduct = null;
        this.showOrderProductForm = false;
    }

    public onEditOrderProductClicked(
        index: number,
    ): boolean {
        this.addOrEditOrderProduct = this.orderProductList[index];
        this.showOrderProductForm = true;

        return false;
    }

    public onDeleteOrderProductClicked(
        index: number,
    ): void {
        const orderProduct: OrderProductResponse = this.orderProductList[index];
        const response: boolean = confirm(`Are you sure you want to delete "${orderProduct.product.name}"?`);
        if (response) {
            this.orderProductList.splice(index, 1);
        }
    }

    public async onSubmitClicked(
    ): Promise<void> {
        this.isSubmitted = true;

        try {
            const orderRequest: OrderRequest = {
                name: toTrim(this.mainFormGroupControls.name.value),
                mobileNumber: this.mainFormGroupControls.mobileNumber.value,
                products: this.orderProductList
                    .map(
                        (value: OrderProductResponse) => {
                            return {
                                productId: value.product.id,
                                numberOfPackets: value.numberOfPackets,
                            };
                        }
                    ),
            };

            if (this.hasValidId) {
                await this._ordersService.modify(this.id!, orderRequest);
            } else {
                await this._ordersService.add(orderRequest);
            }

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