import {
    Injectable,
} from '@angular/core';

import {
    FileService,
} from './file.service';

const JSON_INDENTATION: string = '    ';

export class OrderRequestInvalidError extends Error {
};

export class OrderNotFoundError extends Error {
};

export type OrderProductModel = {
    id: number,
    name: string;
    quantity: number,
    price: number,
};

export type OrderModel = {
    id: number,
    name: string,
    mobileNumber: string,
    products: OrderProductModel[],
};

export type RootModel = {
    eTag: string;
    lastUpdatedAt: string;
    orders: OrderModel[];
};

export type OrderProductRequest = {
    name: string;
    quantity: number,
    price: number,
};

export type OrderRequest = {
    name: string,
    mobileNumber: string,
    products: OrderProductRequest[],
};

@Injectable({
    providedIn: 'root',
})
export class DataService extends FileService {
    private _root: RootModel = {
        eTag: this.newGuid,
        lastUpdatedAt: this.currentUTCDateAsString,
        orders: [],
    };

    private get newGuid(
    ): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : ((r & 0x3) | 0x8);
            
            return v.toString(16);
          });
    }

    private get currentUTCDateAsString(
    ): string {
        return new Date().toUTCString();
    }

    private async get<TJsonObject>(
    ): Promise<TJsonObject> {
        const jsonString: string = await this.readAsString();
        const jsonObject: TJsonObject = JSON.parse(jsonString);
        return jsonObject;
    }

    private async save<TJsonObject>(
        jsonObject: TJsonObject
    ): Promise<void> {
        const jsonString: string = JSON.stringify(jsonObject, null, JSON_INDENTATION);
        await this.writeString(jsonString);
    }

    private get nextOrderId(
    ): number {
        return Math.max(
            ...this._root.orders.map(order => order.id)
        ) + 1;
    }

    private validateOrderAndThrow(
        orderRequest: OrderRequest,
    ): void {
        if (orderRequest == null ||
            orderRequest == undefined
        ) {
            throw new OrderRequestInvalidError(
                'Data "Order Request" is not valid',
            );
        }

        // TODO: Validate all other properties
    }

    private toOrderProduct(
        id: number,
        orderProductRequest: OrderProductRequest,
    ): OrderProductModel {
        return {
            id: id,
            name: orderProductRequest.name,
            quantity: orderProductRequest.quantity,
            price: orderProductRequest.price,
        }
    }

    private toOrderProducts(
        orderProductRequests: OrderProductRequest[],
    ): OrderProductModel[] {
        return orderProductRequests
            .map(
                (orderProductRequest, index) => this.toOrderProduct(index, orderProductRequest)
            );
    }

    public async getRoot(
    ): Promise<RootModel> {
        if (this.hasHandle) {
            this._root = await this.get();
        }

        return this._root;
    }

    public async saveRoot(
    ): Promise<void> {
        this._root.lastUpdatedAt = this.currentUTCDateAsString;

        this.save(this._root);
    }

    public async addOrder(
        orderRequest: OrderRequest,
    ): Promise<void> {
        this.validateOrderAndThrow(orderRequest);

        const order: OrderModel = {
            id: this.nextOrderId,
            name: orderRequest.name,
            mobileNumber: orderRequest.mobileNumber,
            products: this.toOrderProducts(orderRequest.products),
        };
        this._root.orders.push(order);

        await this.saveRoot();
    }

    public async modifyOrder(
        orderId: number,
        orderRequest: OrderRequest,
    ): Promise<void> {
        this.validateOrderAndThrow(orderRequest);

        const orderIndex: number = this._root.orders.findIndex(order => order.id == orderId);
        if (this._root.orders[orderIndex].id != orderId) {
            throw new OrderNotFoundError(
                `Data order with id: "{${orderId}}" not found`,
            );
        }

        const order: OrderModel = {
            id: orderId,
            name: orderRequest.name,
            mobileNumber: orderRequest.mobileNumber,
            products: this.toOrderProducts(orderRequest.products),
        };
        this._root.orders[orderIndex] = order;

        await this.saveRoot();
    }
};