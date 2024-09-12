export type ProductModel = {
    id: string,
    name: string,
    quantity: number,
    price: number,
    sort: number,
    hasOrders: boolean,
};

export type OrderProductModel = {
    productId: string,
    noOfPackets: number,
};

export type OrderModel = {
    id: number,
    name: string,
    mobileNumber: number,
    products: OrderProductModel[],
};

export type RootModel = {
    eTag: string,
    lastUpdatedAt: string,
    products: ProductModel[] | null,
    orders: OrderModel[] | null,
};