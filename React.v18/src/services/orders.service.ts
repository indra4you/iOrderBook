import {
    OrderModel,
    OrderProductModel,
    OrderStatus,
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
    status: OrderStatus,
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

export class OrdersService extends EventTarget {
    public static ADDED_EVENT_NAME: string = 'orderAdded';
    public static MODIFIED_EVENT_NAME: string = 'orderModified';
    public static DELETED_EVENT_NAME: string = 'orderDeleted';

    constructor(
        private readonly _dataService: DataService,
    ) {
        super();
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
            status: order.status,
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
        if (orders.length > 0) {
            return 1 + Math.max(
                ...orders.map((value: OrderModel) => value.id)
            );
        }

        return 1;
    }

    private toSummarizeOrderProducts(
        orderProductModels: OrderProductModel[],
    ): OrderProductModel[] {
        return Object.values(
            orderProductModels
                .reduce(
                    (runningItem: { [key: string]: OrderProductModel }, current: OrderProductModel) => {
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
            (value: OrderModel) => value.id === id
        );

        if (order === null || order === undefined) {
            throw new DataNotFoundError(
                `Order with Id "${id}" not found`,
            );
        }

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
            (value: OrderModel) => value.name === request.name
        );
        if (filteredOrders.length > 0) {
            throw new DataNotUniqueError(
                `Order with Name "${request.name}" already exists`,
            );
        }

        const products: ProductModel[] = root.products ?? [];
        request.products
            .forEach(
                (product: OrderProductModel) => {
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
            status: OrderStatus.Saved,
            name: request.name,
            mobileNumber: request.mobileNumber,
            products: this.toSummarizeOrderProducts(request.products),
        };

        root.orders.push(order);
        await this._dataService.saveRoot(root);

        const orderAddedEvent: CustomEvent<OrderModel> = new CustomEvent(
            OrdersService.ADDED_EVENT_NAME, {
                detail: order,
            }
        );
        this.dispatchEvent(orderAddedEvent);
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
            (value: OrderModel) => value.id !== id && value.name === request.name
        );
        if (orders.length > 0) {
            throw new DataNotUniqueError(
                `Order with Name "${request.name}" already exists`,
            );
        }

        const products: ProductModel[] = root.products ?? [];
        request.products
            .forEach(
                (product: OrderProductModel) => {
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
            status: OrderStatus.Saved,
            name: request.name,
            mobileNumber: request.mobileNumber,
            products: this.toSummarizeOrderProducts(request.products),
        };

        root.orders[index] = order;
        await this._dataService.saveRoot(root);

        const orderModifiedEvent: CustomEvent<OrderModel> = new CustomEvent(
            OrdersService.MODIFIED_EVENT_NAME, {
                detail: order,
            }
        );
        this.dispatchEvent(orderModifiedEvent);
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

        const order: OrderModel = root.orders[index];

        root.orders.splice(index, 1);
        await this._dataService.saveRoot(root);

        const orderDeletedEvent: CustomEvent<OrderModel> = new CustomEvent(
            OrdersService.DELETED_EVENT_NAME, {
                detail: order,
            }
        );
        this.dispatchEvent(orderDeletedEvent);
    }
};