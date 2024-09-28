import {
    Injectable,
} from '@angular/core';

import {
    OrderModel,
    ProductModel,
    RootModel,
} from './data.models';
import {
    DataNotFoundError,
    DataNotUniqueError,
    DataReferenceError,
    DataService,
} from './data.service';

export type ProductResponse = ProductModel & {
    hasOrders: boolean,
};

export type ProductRequest = {
    name: string,
    quantity: number,
    price: number,
    sort: number,
};

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    constructor(
        private readonly _dataService: DataService,
    ) {
    }

    private toProductResponse(
        product: ProductModel,
        orders: OrderModel[],
    ): ProductResponse {
        const hasOrders: boolean = orders
            .some(
                (order) => order.products.some(
                    (orderProduct) => orderProduct.productId === product.id
                )
            );

        return {
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            sort: product.sort,
            hasOrders: hasOrders,
        }
    }

    private toProductResponses(
        products: ProductModel[],
        orders: OrderModel[],
    ): ProductResponse[] {
        return products
            .map(
                (value: ProductModel) => this.toProductResponse(value, orders)
            );
    }

    public async getAll(
    ): Promise<ProductResponse[]> {
        const root: RootModel = await this._dataService.getRoot();
        const products: ProductModel[] = root.products ?? [];

        return this.toProductResponses(
            products,
            root.orders ?? []
        );
    }

    public async getById(
        id: string,
    ): Promise<ProductResponse> {
        const root: RootModel = await this._dataService.getRoot();
        const products: ProductModel[] = root.products ?? [];
        const [product]: ProductModel[] = products.filter(
            (value: ProductModel) => value.id === id
        );

        if (product === null || product === undefined) {
            throw new DataNotFoundError(
                `Product with Id "${id}" not found`,
            );
        }

        return this.toProductResponse(
            product,
            root.orders ?? [],
        );
    }
    
    public async add(
        request: ProductRequest,
    ): Promise<void> {
        const root: RootModel = await this._dataService.getRoot();
        root.products = root.products ?? [];

        const filteredProducts: ProductModel[] = root.products.filter(
            (value: ProductModel) => value.name === request.name
        );
        if (filteredProducts.length > 0) {
            throw new DataNotUniqueError(
                `Product with Name "${request.name}" already exists`,
            );
        }

        const product: ProductModel = {
            id: this._dataService.newGuid,
            name: request.name,
            quantity: request.quantity,
            price: request.price,
            sort: request.sort,
        };

        root.products.push(product);
        await this._dataService.saveRoot(root);
    }

    public async modify(
        id: string,
        request: ProductRequest,
    ): Promise<void> {
        const root: RootModel = await this._dataService.getRoot();
        root.products = root.products ?? [];

        const index: number = root.products.findIndex(
            (value) => value.id === id
        );
        if (index === -1) {
            throw new DataNotFoundError(
                `Product with Id "${id}" not found`,
            );
        }

        const products: ProductModel[] = root.products.filter(
            (value: ProductModel) => value.id !== id && value.name === request.name
        );
        if (products.length > 0) {
            throw new DataNotUniqueError(
                `Product with Name "${request.name}" already exists`,
            );
        }

        const product: ProductModel = {
            id: id,
            name: request.name,
            quantity: request.quantity,
            price: request.price,
            sort: request.sort,
        };

        root.products[index] = product;
        await this._dataService.saveRoot(root);
    }

    public async delete(
        id: string,
    ): Promise<void> {
        const root: RootModel = await this._dataService.getRoot();
        root.products = root.products ?? [];

        const index: number = root.products.findIndex(
            (value) => value.id === id
        );
        if (index === -1) {
            throw new DataNotFoundError(
                `Product with Id '${id}' not found`,
            );
        }

        const hasOrders: boolean = (root.orders ?? [])
            .some(
                (order) => order.products.some(
                    (orderProduct) => orderProduct.productId === id
                )
            );
        if (hasOrders) {
            throw new DataReferenceError(
                `Product with Id '${id}' is being used in "Orders"`,
            );
        }

        root.products.splice(index, 1);
        await this._dataService.saveRoot(root);
    }
};