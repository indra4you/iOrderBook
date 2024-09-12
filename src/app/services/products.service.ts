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
    DataService,
} from './data.service';

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

    private async hasOrdersById(
        id: string,
    ): Promise<boolean> {
        const rootModel: RootModel = await this._dataService.getRoot();
        const orders: OrderModel[] = rootModel.orders ?? [];

        return orders.some(
            order => order.products.some(
                product => product.productId === id
            )
        );
    }

    public async getAll(
    ): Promise<ProductModel[]> {
        const rootModel: RootModel = await this._dataService.getRoot();
        const products: ProductModel[] = rootModel.products ?? [];

        await products.forEach(
            async (value) => value.hasOrders = await this.hasOrdersById(value.id)
        )

        return products;
    }

    public async getById(
        id: string,
    ): Promise<ProductModel> {
        const products: ProductModel[] = await this.getAll();
        const [product]: ProductModel[] = products.filter(
            (value) => value.id === id
        );

        product.hasOrders = await this.hasOrdersById(id);

        return product;
    }
    
    public async add(
        request: ProductRequest,
    ): Promise<void> {
        const root: RootModel = await this._dataService.getRoot();
        root.products = root.products ?? [];

        const filteredProducts: ProductModel[] = root.products.filter(
            (value) => value.name === request.name
        );
        if (filteredProducts.length > 0) {
            throw new DataNotUniqueError(
                `Product with Name: '${request.name}' already exists`,
            );
        }

        const product: ProductModel = {
            id: this._dataService.newGuid,
            name: request.name,
            quantity: request.quantity,
            price: request.price,
            sort: request.sort,
            hasOrders: false,
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
                `Product with Id: '${id}' not found`,
            );
        }

        const products: ProductModel[] = root.products.filter(
            (value) => value.id !== id && value.name === request.name
        );
        if (products.length > 0) {
            throw new DataNotUniqueError(
                `Product with Name: '${request.name}' already exists`,
            );
        }

        const product: ProductModel = {
            id: id,
            name: request.name,
            quantity: request.quantity,
            price: request.price,
            sort: request.sort,
            hasOrders: false,
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
                `Product with Id: '${id}' not found`,
            );
        }

        root.products.splice(index, 1);
        await this._dataService.saveRoot(root);
    }
};