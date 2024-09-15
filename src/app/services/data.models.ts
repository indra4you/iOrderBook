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

export type OrderModel = {
    id: number,
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