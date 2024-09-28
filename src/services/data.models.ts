export type ProductModel = {
    id: string,
    name: string,
    quantity: number,
    price: number,
    sort: number,
};

export type OrderProductModel = {
    productId: string,
    numberOfPackets: number,
}

export enum OrderStatus {
    InProgress = 0,
    Saved = 10,
    Delivered = 20,
};

export namespace OrderStatus {
    export function toString(
        orderStatus: OrderStatus,
    ): string {
        switch (orderStatus) {
            case OrderStatus.InProgress:
                return 'In Progress';
            case OrderStatus.Saved:
                return 'Saved';
            case OrderStatus.Delivered:
                return 'Delivered';
        }
    }

    export function fromString(
        orderStatus: string,
    ): OrderStatus {
        switch (orderStatus) {
            case 'In Progress':
                return OrderStatus.InProgress;
            case 'Saved':
                return OrderStatus.Saved;
            case 'Delivered':
                return OrderStatus.Delivered;
            default:
                throw new Error(
                    `Failed to parse "OrderStatus" value "${orderStatus}"`,
                );
        }
    }
}

export type OrderModel = {
    id: number,
    status: OrderStatus,
    name: string,
    mobileNumber: string,
    products: OrderProductModel[],
};

export type RootModel = {
    eTag: string,
    lastUpdatedAt: string,
    products: ProductModel[] | null,
    orders: OrderModel[] | null,
};