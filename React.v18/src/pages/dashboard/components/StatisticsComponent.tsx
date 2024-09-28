import {
    OrderResponse,
    OrderStatus,
    ProductResponse,
} from '../../../services';
import {
    ProductTable,
} from './Domains';

type StatisticsProps = {
    products: ProductResponse[],
    orders: OrderResponse[],
    productTableList: ProductTable[],
};

export const StatisticsComponent = (
    props: StatisticsProps,
): JSX.Element => {
    function noOfProducts(
    ): number {
        return props.products.length;
    };

    function noOfOrders(
    ): number {
        return props.orders.length;
    };

    function noOfSavedOrders(
    ): number {
        return props.orders
            .filter(
                (value: OrderResponse) => value.status === OrderStatus.Saved,
            )
            .length;
    };

    function noOfDeliveredOrders(
    ): number {
        return props.orders
            .filter(
                (value: OrderResponse) => value.status === OrderStatus.Delivered,
            )
            .length;
    };

    function grandTotalProductOrderQuantity(
    ): number {
        return props.productTableList
            .reduce(
                (runningSum: number, current: ProductTable) => runningSum += current.totalQuantity,
                0,
            );
    }

    return (
        <div className="row mt-4">
            <div className="col-12 col-md-6">
                <h2>Orders</h2>

                <div className="row text-center">
                    <div className="col-6 col-sm-4 col-xl-3 mb-4">
                        <div className="h-100 p-3 border rounded-3 border-light-subtle bg-light-subtle">
                            <span className="display-6">{ noOfOrders() }</span>
                            <br />
                            <span>Total</span>
                        </div>
                    </div>

                    <div className="col-6 col-sm-4 col-xl-3 mb-4">
                        <div className="h-100 p-3 border rounded-3 border-primary-subtle bg-primary-subtle">
                            <span className="display-6">{ noOfSavedOrders() }</span>
                            <br />
                            <span>Saved</span>
                        </div>
                    </div>
                    
                    <div className="col-6 col-sm-4 col-xl-3 mb-4">
                        <div className="h-100 p-3 border rounded-3 border-success-subtle bg-success-subtle">
                            <span className="display-6">{ noOfDeliveredOrders() }</span>
                            <br />
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-md-6">
                <h2 className="text-md-end">Totals</h2>

                <div className="row text-center d-flex justify-content-md-end">
                    <div className="col-6 col-sm-4 col-xl-3 mb-4">
                        <div className="h-100 p-3 border rounded-3 border-light-subtle bg-light-subtle">
                            <span className="display-6">{ noOfProducts() }</span>
                            <br />
                            <span>Proudcts</span>
                        </div>
                    </div>

                    <div className="col-6 col-sm-4 col-xl-3 mb-4">
                        <div className="h-100 p-3 border rounded-3 border-light-subtle bg-light-subtle">
                            <span className="display-6">{ grandTotalProductOrderQuantity() }</span>
                            <br />
                            <span>Packets</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsComponent;