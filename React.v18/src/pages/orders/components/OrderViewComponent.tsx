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
        <>
            <div className="row">
                <div className="col-md-8 mb-3">
                    <label className="fw-bold">Name</label>

                    <span className="form-control-plaintext">{ props.order.name }</span>
                </div>

                <div className="col-md-4 mb-3">
                    <label className="fw-bold">Mobile Number</label>

                    <span className="form-control-plaintext">{ props.order.mobileNumber }</span>
                </div>
            </div>

            <h3 className="mt-3">
                Products
            </h3>

            <div className="table-responsive border rounded mb-3">
                <table className="table table-hover table-striped align-middle mb-0">
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
                </table>
            </div>
        </>
    );
};

export default OrderViewComponent;