import {
    Injectable,
} from '@angular/core';

import {
    OrderModel,
    OrderProductModel,
    ProductModel,
    RootModel,
} from './data.models';
import {
    DataNotFoundError,
    DataNotUniqueError,
    DataReferenceError,
    DataService,
} from './data.service';

export type OrderProductResponse = {
    product: ProductModel,
    numberOfPackets: number,
    amount: number,
};

export type OrderResponse = {
    id: number,
    name: string,
    mobileNumber: string,
    products: OrderProductResponse[],
    totalNumberOfPackets: number,
    totalAmount: number,
};

export type OrderRequest = {
    name: string,
    mobileNumber: string,
    products: OrderProductModel[],
};

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(
        private readonly _dataService: DataService,
    ) {
    }

    private toOrderProductResponse(
        orderProduct: OrderProductModel,
        products: ProductModel[],
    ): OrderProductResponse {
        const [product]: ProductModel[] = products.filter(
            (value: ProductModel) => value.id === orderProduct.productId
        );

        return {
            product: product,
            numberOfPackets: orderProduct.numberOfPackets,
            amount: orderProduct.numberOfPackets * product.price,
        };
    }

    private toOrderProductResponses(
        orderProducts: OrderProductModel[],
        products: ProductModel[],
    ): OrderProductResponse[] {
        return orderProducts
            .map(
                (value: OrderProductModel) => this.toOrderProductResponse(value, products)
            );
    }

    private toOrderResponse(
        order: OrderModel,
        products: ProductModel[],
    ): OrderResponse {
        const orderProducts: OrderProductResponse[] = this.toOrderProductResponses(
            order.products,
            products
        );
        const totalNumberOfPackets: number = orderProducts
            .reduce(
                (runningSum: number, current: OrderProductResponse) => runningSum + current.numberOfPackets,
                0,
            );
        const totalAmount: number = orderProducts
            .reduce(
                (runningSum: number, current: OrderProductResponse) => runningSum + (current.numberOfPackets * current.product.price),
                0,
            );

        return {
            id: order.id,
            name: order.name,
            mobileNumber: order.mobileNumber,
            products: orderProducts,
            totalNumberOfPackets: totalNumberOfPackets,
            totalAmount: totalAmount,
        }
    }

    private toOrderResponses(
        orders: OrderModel[],
        products: ProductModel[],
    ): OrderResponse[] {
        return orders
            .map(
                (value: OrderModel) => this.toOrderResponse(value, products)
            );
    }

    private getNextOrderId(
        orders: OrderModel[],
    ): number {
        return 1 + Math.max(
            ...orders.map((value) => value.id)
        );
    }

    private toSummarizeOrderProducts(
        orderProductModels: OrderProductModel[],
    ): OrderProductModel[] {
        return Object.values(
            orderProductModels.reduce(
                (runningItem, current) => {
                    if (runningItem[current.productId]) {
                        runningItem[current.productId].numberOfPackets += current.numberOfPackets;
                    } else {
                        runningItem[current.productId] = { ...current };
                    }

                    return runningItem;
                },
                { } as { [key: string]: OrderProductModel },
            )
        )
    }

    public async getAll(
    ): Promise<OrderResponse[]> {
        const root: RootModel = await this._dataService.getRoot();
        const orders: OrderModel[] = root.orders ?? [];

        return this.toOrderResponses(
            orders,
            root.products ?? []
        );
    }

    public async getById(
        id: number,
    ): Promise<OrderResponse> {
        const root: RootModel = await this._dataService.getRoot();
        const orders: OrderModel[] = root.orders ?? [];
        const [order]: OrderModel[] = orders.filter(
            (value) => value.id === id
        );

        return this.toOrderResponse(
            order,
            root.products ?? [],
        );
    }
    
    public async add(
        request: OrderRequest,
    ): Promise<void> {
        const root: RootModel = await this._dataService.getRoot();
        root.orders = root.orders ?? [];

        const filteredOrders: OrderModel[] = root.orders.filter(
            (value) => value.name === request.name
        );
        if (filteredOrders.length > 0) {
            throw new DataNotUniqueError(
                `Order with Name "${request.name}" already exists`,
            );
        }

        const products: ProductModel[] = root.products ?? [];
        request.products
            .forEach(
                (product) => {
                    const found: boolean = products
                        .some(
                            (value) => value.id === product.productId
                        );
                    if (!found) {
                        throw new DataReferenceError(
                            `Selected Product with Id "${product.productId}" not found in the product list`,
                        );
                    }
                }
            );

        const order: OrderModel = {
            id: this.getNextOrderId(root.orders),
            name: request.name,
            mobileNumber: request.mobileNumber,
            products: this.toSummarizeOrderProducts(request.products),
        };

        root.orders.push(order);
        await this._dataService.saveRoot(root);
    }

    public async modify(
        id: number,
        request: OrderRequest,
    ): Promise<void> {
        const root: RootModel = await this._dataService.getRoot();
        root.orders = root.orders ?? [];

        const index: number = root.orders.findIndex(
            (value) => value.id === id
        );
        if (index === -1) {
            throw new DataNotFoundError(
                `Order with Id "${id}" not found`,
            );
        }

        const orders: OrderModel[] = root.orders.filter(
            (value) => value.id !== id && value.name === request.name
        );
        if (orders.length > 0) {
            throw new DataNotUniqueError(
                `Order with Name "${request.name}" already exists`,
            );
        }

        const products: ProductModel[] = root.products ?? [];
        request.products
            .forEach(
                (product) => {
                    const hasProduct: boolean = products
                        .some(
                            (value) => value.id === product.productId
                        );
                    if (!hasProduct) {
                        throw new DataReferenceError(
                            `Selected Product with Id "${product.productId}" not found in the product list`,
                        );
                    }
                }
            );

        const order: OrderModel = {
            id: id,
            name: request.name,
            mobileNumber: request.mobileNumber,
            products: this.toSummarizeOrderProducts(request.products),
        };

        root.orders[index] = order;
        await this._dataService.saveRoot(root);
    }

    public async delete(
        id: number,
    ): Promise<void> {
        const root: RootModel = await this._dataService.getRoot();
        root.orders = root.orders ?? [];

        const index: number = root.orders.findIndex(
            (value) => value.id === id
        );
        if (index === -1) {
            throw new DataNotFoundError(
                `Order with Id '${id}' not found`,
            );
        }

        root.orders.splice(index, 1);
        await this._dataService.saveRoot(root);
    }
};