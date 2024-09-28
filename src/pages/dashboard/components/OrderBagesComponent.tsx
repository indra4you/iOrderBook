import {
    hasNoValue,
} from '../../../Extensions';
import {
    OrderResponse,
    OrderStatus,
} from '../../../services';

type OrderBagesProps = {
    orders: OrderResponse[],
};

export const OrderBagesComponent = (
    props: OrderBagesProps,
): JSX.Element => {
    function getOrderStatusClass(
        orderStatus: OrderStatus,
    ): string {
        switch (orderStatus) {
            case OrderStatus.InProgress:
                return 'border-danger-subtle bg-danger-subtle';
            case OrderStatus.Saved:
                return 'border-primary-subtle bg-primary-subtle';
            case OrderStatus.Delivered:
                return 'border-success-subtle bg-success-subtle';
        }
    };

    function getOrderStatusBorderClass(
        orderStatus: OrderStatus,
    ): string {
        switch (orderStatus) {
            case OrderStatus.InProgress:
                return 'border-danger-subtle';
            case OrderStatus.Saved:
                return 'border-primary-subtle';
            case OrderStatus.Delivered:
                return 'border-success-subtle';
        }
    };

    if (hasNoValue(props.orders)) {
        return (
            <>
                <h2 className="mt-5">Orders</h2>

                <div className="lead text-center text-muted py-2 mb-3">
                    No Orders
                </div>
            </>
        );
    }

    return (
        <>
            <h2 className="mt-5">Orders</h2>

            <div className="row">
                {
                    props.orders
                        .map(
                            (order: OrderResponse, index: number) => {
                                return (
                                    <div key={index} className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3">
                                        <div className={`row gx-2 border rounded text-nowrap ${getOrderStatusClass(order.status)}`}>
                                            <div className="col-6 text-end p-2">
                                                { order.id }
                                            </div>

                                            <div className={`col-6 col-md-4 col-lg-3 col-xl-2 p-2 border-3 border-start text-nowrap ${getOrderStatusBorderClass(order.status)}`}>
                                                { order.totalAmount } ₹
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )
                }
            </div>
        </>
    );
};

export default OrderBagesComponent;