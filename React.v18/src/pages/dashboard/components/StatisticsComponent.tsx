import {
    Col,
    Container,
    Row,
} from 'react-bootstrap';

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
        <div className="border-bottom pt-4 py-md-4 text-bg-light">
            <Container>
                <Row>
                    <Col md="6">
                        <h1>Orders</h1>

                        <Row className="text-center">
                            <Col xs="6" sm="4" xl="3" className="mb-4">
                                <div className="h-100 p-3 border border-secondary-subtle rounded-4 bg-status-light shadow">
                                    <span className="display-6">{ noOfOrders() }</span>
                                    <br />
                                    <span>Total</span>
                                </div>
                            </Col>

                            <Col xs="6" sm="4" xl="3" className="mb-4">
                                <div className="h-100 p-3 border border-secondary-subtle rounded-4 bg-status-saved shadow">
                                    <span className="display-6">{ noOfSavedOrders() }</span>
                                    <br />
                                    <span>Saved</span>
                                </div>
                            </Col>
                            
                            <Col xs="6" sm="4" xl="3" className="mb-4">
                                <div className="h-100 p-3 border border-secondary-subtle rounded-4 bg-status-delivered shadow">
                                    <span className="display-6">{ noOfDeliveredOrders() }</span>
                                    <br />
                                    <span>Delivered</span>
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    <Col md="6">
                        <h1 className="text-md-end">Totals</h1>

                        <Row className="justify-content-md-end text-center">
                            <Col xs="6" sm="4" xl="3" className="mb-4">
                                <div className="h-100 p-3 border border-secondary-subtle rounded-4 bg-status-light shadow">
                                    <span className="display-6">{ noOfProducts() }</span>
                                    <br />
                                    <span>Proudcts</span>
                                </div>
                            </Col>

                            <Col xs="6" sm="4" xl="3" className="mb-4">
                                <div className="h-100 p-3 border border-secondary-subtle rounded-4 bg-status-light shadow">
                                    <span className="display-6">{ grandTotalProductOrderQuantity() }</span>
                                    <br />
                                    <span>Packets</span>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StatisticsComponent;