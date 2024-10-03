import {
    Col,
    Form,
    Row,
    Table,
} from 'react-bootstrap';

import {
    OrderProductResponse,
    OrderResponse,
} from '../../../services';

type OrderViewProps = {
    order: OrderResponse,
};

export const OrderViewComponent = (
    props: OrderViewProps,
): JSX.Element => {
    return (
        <Form>
            <Row>
                <Col xs="12" md="8" className="mb-3">
                    <Form.Label className="fw-bold mb-0">Name</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={ props.order.name } />
                </Col>

                <Col xs="12" md="4" className="mb-3">
                    <Form.Label className="fw-bold mb-0">Mobile Number</Form.Label>
                    <Form.Control plaintext readOnly defaultValue={ props.order.mobileNumber } />
                </Col>
            </Row>

            <h3 className="mt-3">
                Products
            </h3>

            <div className="table-responsive border rounded mb-3">
                <Table className="table table-hover table-striped align-middle mb-0">
                    <colgroup>
                        <col width="3%" />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                    </colgroup>

                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Product</th>
                            <th scope="col" className="text-end">Quantity</th>
                            <th scope="col" className="text-end">Price</th>
                            <th scope="col" className="text-end">No of Packets</th>
                            <th scope="col" className="text-end">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            props.order.products
                                .map((orderProduct: OrderProductResponse, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row" className="text-end">{ index + 1 }.</th>
                                            <td>{ orderProduct.product.name }</td>
                                            <td className="text-end">{ orderProduct.product.quantity } grams</td>
                                            <td className="text-end">{ orderProduct.product.price } ₹</td>
                                            <td className="text-end">{ orderProduct.numberOfPackets }</td>
                                            <td className="text-end">{ orderProduct.amount } ₹</td>
                                        </tr>
                                    )
                                })
                        }
                    </tbody>
                </Table>
            </div>
        </Form>
    );
};

export default OrderViewComponent;