import {
    NgClass,
} from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
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
    ProductResponse,
    ProductRequest,
    ProductsService,
} from '../../../../services';
import {
    toTrim,
} from '../../../../string';

@Component({
    standalone: true,
    selector: 'product-form',
    imports: [
        ReactiveFormsModule,
        NgClass,
    ],
    templateUrl: './product.form.component.html'
})
export class ProductFormComponent implements AfterViewInit {
    public readonly _noOfFields: number[] = [...Array(3).keys()];

    @Input('id')
    public id: string | null = null;

    @ViewChild('focusOn')
    public focusOn: ElementRef<HTMLInputElement> | undefined;
    
    @Output('onClose')
    public onClose: EventEmitter<void> = new EventEmitter();
    
    public isLoading: boolean = true;
    public mainFormGroup: FormGroup;
    public errorMessage: string = '';
    public isSubmitted: boolean = false;

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
        const product: ProductResponse = await this.load();
        const productPrice: string = product.id === 'NEW' ? '' : product.price.toString();

        this.mainFormGroup = this._formBuilder.group({
            name: new FormControl(product.name, [Validators.required, Validators.minLength(3)]),
            quantity: new FormControl(product.quantity, [Validators.required, Validators.min(10), Validators.max(1000)]),
            price: new FormControl(productPrice, [Validators.required, Validators.min(10), Validators.max(2000)]),
            sort: new FormControl(product.sort, [Validators.required, Validators.min(100), Validators.max(2000)]),
        });

        this.isLoading = false;

        setTimeout(
            () => {
                this.focusOn?.nativeElement.focus();
            },
            500,
        );
    }

    private async load(
    ): Promise<ProductResponse> {
        if (this.hasValidId) {
            const product: ProductResponse = await this._productsService.getById(this.id!);

            return product;
        }

        return {
            id: 'NEW',
            name: '',
            quantity: 500,
            price: -1,
            sort: 100,
            hasOrders: false,
        };
    }

    public get hasValidId(
    ): boolean {
        return this.id !== null && this.id!.length > 0;
    }

    public get hasError(
    ): boolean {
        return this.errorMessage.length > 0;
    }

    public get mainFormGroupControls(
    ): { [key: string]: AbstractControl } {
        return this.mainFormGroup.controls;
    }

    public onCancelClicked(
    ): void {
        this.onClose.emit();
    }

    public async onSubmitClicked(
    ): Promise<void> {
        this.isSubmitted = true;

        try {
            const request: ProductRequest = {
                name: toTrim(this.mainFormGroupControls.name.value),
                quantity: this.mainFormGroupControls.quantity.value,
                price: this.mainFormGroupControls.price.value,
                sort: this.mainFormGroupControls.sort.value,
            };

            if (this.hasValidId) {
                await this._productsService.modify(this.id!, request);
            } else {
                await this._productsService.add(request);
            }

            this.onClose.emit();
        } catch (error) {
            const err: Error = error as Error;
            this.errorMessage = err.message;
            this.isSubmitted = false;
        }
    }
};