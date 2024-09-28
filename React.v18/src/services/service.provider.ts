import {
    Context,
    createContext,
    useContext,
} from 'react';

import {
    DataService,
} from './data.service';
import {
    OrdersService,
} from './orders.service';
import {
    ProductsService,
} from './products.service';

export class ServiceProvider {
    private readonly _dataService: DataService;
    private _productsService: ProductsService | null = null;
    private _ordersService: OrdersService | null = null;

    constructor(
    ) {
        this._dataService = new DataService();
    }

    public get data(
    ): DataService {
        return this._dataService;
    }

    public get products(
    ): ProductsService {
        return this._productsService ??= new ProductsService(this._dataService);
    }

    public get orders(
    ): OrdersService {
        return this._ordersService ??= new OrdersService(this._dataService);
    }
};

export const ServiceContext: Context<ServiceProvider | null> = createContext<ServiceProvider | null>(
    null,
);

export const useServiceContext = (): ServiceProvider | null => useContext<ServiceProvider | null>(ServiceContext);