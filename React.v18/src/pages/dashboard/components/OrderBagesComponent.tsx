import {
    Col,
    Container,
    Row,
} from 'react-bootstrap';

import {
    hasNoValue,
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
                return 'border-warning-subtle bg-status-in-progress';
            case OrderStatus.Saved:
                return 'border-primary-subtle bg-status-saved';
            case OrderStatus.Delivered:
                return 'border-success-subtle bg-status-delivered';
        }
    };

    function getOrderStatusBorderClass(
        orderStatus: OrderStatus,
    ): string {
        switch (orderStatus) {
            case OrderStatus.InProgress:
                return 'border-warning-subtle';
            case OrderStatus.Saved:
                return 'border-primary-subtle';
            case OrderStatus.Delivered:
                return 'border-success-subtle';
        }
    };

    if (hasNoValue(props.orders)) {
        return (
            <div className="pt-4 py-md-4 bg-light-subtle">
                <Container>
                    <h1 className="my-4">Orders</h1>

                    <div className="lead text-center text-muted py-2 mb-5">
                        No Orders
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="pt-4 py-md-4 bg-light-subtle">
            <Container>
                <h1 className="my-4">Orders</h1>

                <Row className="mb-3">
                    {
                        props.orders
                            .map(
                                (order: OrderResponse, index: number) => {
                                    return (
                                        <Col key={index} xs="6" md="4" lg="3" xl="2" className="mb-3">
                                            <Row className={`gx-2 border rounded shadow text-nowrap ${getOrderStatusClass(order.status)}`}>
                                                <Col className="text-end p-2">
                                                    { order.id }
                                                </Col>

                                                <Col className={`p-2 border-4 border-start text-nowrap ${getOrderStatusBorderClass(order.status)}`}>
                                                    { order.totalAmount } ₹
                                                </Col>
                                            </Row>
                                        </Col>
                                    );
                                }
                            )
                    }
                </Row>
            </Container>
        </div>
    );
};

export default OrderBagesComponent;