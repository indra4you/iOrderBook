import {
    OrderResponse,
    ProductResponse,
} from '../../../services';

export type ProductTable = {
    name: string,
    noOfOrders: number,
    totalQuantity: number,
    totalAmount: number,
};

export type DashboardData = {
    products: ProductResponse[],
    orders: OrderResponse[],
    productTableList: ProductTable[],
};