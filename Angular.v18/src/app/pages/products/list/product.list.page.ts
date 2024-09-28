import {
    Component,
    OnInit,
} from '@angular/core';

import {
    ProductResponse,
    ProductsService,
} from '../../../services';
import {
    ProductDeleteComponent,
    ProductFormComponent,
} from '../components';

@Component({
    standalone: true,
    imports: [
        ProductFormComponent,
        ProductDeleteComponent,
    ],
    templateUrl: './product.list.page.html'
})
export class ProductListPage implements OnInit {
    public readonly _noOfFields: number[] = [...Array(3).keys()];

    public isLoading: boolean = true;
    public products: ProductResponse[] = [];
    public showProductForm: boolean = false;
    public showProductDelete: boolean = false;
    public productEditOrDeleteId: string = '';

    constructor(
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

        this.products = await this._productsService.getAll();
        
        this.isLoading = false;
    }

    public get hasProducts(
    ): boolean {
        return this.products.length > 0;
    }

    public onAddProductClicked(
    ): boolean {
        this.showProductForm = true;

        return false;
    }

    public onEditProductClicked(
        index: number,
    ): void {
        const product: ProductResponse = this.products[index];

        this.productEditOrDeleteId = product.id;
        this.showProductForm = true;
    }

    public onProductFormClose(
    ): void {
        this.productEditOrDeleteId = '';
        this.showProductForm = false;

        this.load();
    }

    public onDeleteProductClicked(
        index: number,
    ): void {
        const product: ProductResponse = this.products[index];

        this.productEditOrDeleteId = product.id;
        this.showProductDelete = true;
    }

    public onProductDeleteClose(
        deleted: boolean,
    ): void {
        this.showProductDelete = false;

        if (deleted) {
            this.productEditOrDeleteId = '';

            this.load();
        }
    }
};