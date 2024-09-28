import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';

import {
    ProductResponse,
    ProductsService,
} from '../../../../services';

@Component({
    standalone: true,
    selector: 'product-delete',
    templateUrl: './product.delete.component.html'
})
export class ProductDeleteComponent implements OnInit {
    public readonly _noOfFields: number[] = [...Array(3).keys()];

    @Input('id')
    public id: string | null = null;
    
    @Output('onClose')
    public onClose: EventEmitter<boolean> = new EventEmitter(false);
    
    public errorMessage: string = '';
    public isLoading: boolean = true;
    public product: ProductResponse | null = null;
    public isSubmitted: boolean = false;

    constructor(
        private readonly _productsService: ProductsService,
    ) {
    }

    ngOnInit(
    ): void {
        setTimeout(
            () => {
                this.load();
            },
            500,
        );
    }

    private async load(
    ): Promise<void> {
        this.isLoading = true;
        
        this.product = await this._productsService.getById(this.id!);

        this.isLoading = false;
    }

    public get hasError(
    ): boolean {
        return this.errorMessage.length > 0;
    }

    public onCancelClicked(
    ): void {
        this.onClose.emit(false);
    }

    public async onDeleteClicked(
    ): Promise<void> {
        this.isSubmitted = true;

        try {
            await this._productsService.delete(this.id!);

            this.onClose.emit(true);
        } catch (error) {
            const err: Error = error as Error;
            this.errorMessage = err.message;
            this.isSubmitted = false;
        }
    }
};