import {
    NgClass,
} from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    input,
    Output,
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
    OrderProductResponse,
    ProductModel,
    ProductResponse,
    ProductsService,
} from '../../../../services';

@Component({
    standalone: true,
    selector: 'order-product-form',
    imports: [
        ReactiveFormsModule,
        NgClass,
    ],
    templateUrl: './order.product.form.component.html'
})
export class OrderProductFormComponent implements AfterViewInit {
    public readonly _noOfFields: number[] = [...Array(3).keys()];

    @Input('orderProduct')
    public orderProduct: OrderProductResponse | null = null;
    
    @Output('onClose')
    public onClose: EventEmitter<OrderProductResponse | null> = new EventEmitter();

    @ViewChild('focusOn')
    public focusOn: ElementRef<HTMLInputElement> | undefined;
    
    public isLoading: boolean = true;
    public products: ProductResponse[] = [];
    public product: ProductModel | null = null;
    public mainFormGroup: FormGroup;
    public errorMessage: string = '';

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _productsService: ProductsService,
    ) {
        this.mainFormGroup = this._formBuilder.group({});
    }

    ngAfterViewInit(
    ): void {
        setTimeout(
            () => {
                this.isLoading = true;

                this.setupFormGroup();
            },
            500,
        );
    }

    private async setupFormGroup(
    ): Promise<void> {
        this.products = await this._productsService.getAll();

        if (this.orderProduct === null) {
            this.product = null;
            this.mainFormGroup = this._formBuilder.group({
                productId: new FormControl('', [Validators.required]),
                quantity: new FormControl('', [Validators.required, Validators.min(1)]),
            });
        } else {
            const indexOfProdct: number = this.products
                .findIndex(
                    (value) => value.id == this.orderProduct!.product.id
                );
            
            this.product = this.products[indexOfProdct];
            this.mainFormGroup = this._formBuilder.group({
                productId: new FormControl(indexOfProdct, [Validators.required]),
                quantity: new FormControl(this.orderProduct.numberOfPackets, [Validators.required, Validators.min(1)]),
            });
        }

        this.isLoading = false;

        setTimeout(
            () => {
                this.focusOn?.nativeElement.focus();
            },
            500,
        );
    }

    public get hasError(
    ): boolean {
        return this.errorMessage.length > 0;
    }

    public get hasProduct(
    ): boolean {
        return this.product !== null;
    }

    public get amount(
    ): number {
        if (!this.hasProduct) {
            return 0;
        }

        return this.mainFormGroupControls.quantity.value * this.product!.price;
    }

    public get mainFormGroupControls(
    ): { [key: string]: AbstractControl } {
        return this.mainFormGroup.controls;
    }

    public onProductSelected(
        index: number,
    ): void {
        this.product = this.products[index];
    }

    public onCancelClicked(
    ): void {
        this.onClose.emit(null);
    }

    public onSubmitClicked(
    ): void {
        const orderProduct: OrderProductResponse = {
            product: this.product!,
            numberOfPackets: this.mainFormGroupControls.quantity.value,
            amount: this.mainFormGroupControls.quantity.value * this.product!.price,
        };

        this.onClose.emit(orderProduct);
    }
};