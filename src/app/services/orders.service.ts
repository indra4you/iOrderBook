import {
    Injectable,
} from '@angular/core';

import {
    OrderModel,
    RootModel,
} from './data.models';
import {
    DataNotFoundError,
    DataNotUniqueError,
    DataService,
} from './data.service';

export type OrderProductRequest = {
    productId: string,
    noOfPackets: number,
};

export type OrderRequest = {
    name: string,
    mobileNumber: number,
    products: OrderProductRequest[],
};

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(
        private readonly _dataService: DataService,
    ) {
    }

    private getNextOrderNumber(
        existingOrder: OrderModel[],
    ): number {
        return 1 + Math.max(
            ...existingOrder.map((value) => value.id)
        );
    }

    private toSummarizeOrderProducts(
        orderProductRequest: OrderProductRequest[],
    ): OrderProductRequest[] {
        return Object.values(
            orderProductRequest.reduce(
                (previous, current) => {
                    if (previous[current.productId]) {
                        previous[current.productId].noOfPackets += current.noOfPackets;
                    } else {
                        previous[current.productId] = { ...current };
                    }

                    return previous;
                },
                { } as { [key: string]: OrderProductRequest },
            )
        )
    }

    public async getAll(
    ): Promise<OrderModel[]> {
        const rootModel: RootModel = await this._dataService.getRoot();

        return rootModel.orders ?? [];
    }

    public async getById(
        id: number,
    ): Promise<OrderModel> {
        const orders: OrderModel[] = await this.getAll();
        const [order]: OrderModel[] = orders.filter(
            (value) => value.id === id
        );

        return order;
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
                `Order for '${request.name}' already exists`,
            );
        }

        const order: OrderModel = {
            id: this.getNextOrderNumber(root.orders),
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
                `Order with Id: '${id}' not found`,
            );
        }

        const orders: OrderModel[] = root.orders.filter(
            (value) => value.id !== id && value.name === request.name
        );
        if (orders.length > 0) {
            throw new DataNotUniqueError(
                `Order for '${request.name}' already exists`,
            );
        }

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
                `Order with Id: '${id}' not found`,
            );
        }

        root.orders.splice(index, 1);
        await this._dataService.saveRoot(root);
    }
};