import {
    Container,
    Table,
} from 'react-bootstrap';

import {
    hasNoValue,
    OrderResponse,
    ProductResponse,
} from '../../../services';
import {
    ProductTable,
} from './Domains';

type ProductSummaryProps = {
    products: ProductResponse[],
    orders: OrderResponse[],
    productTableList: ProductTable[],
};

export const ProductSummaryComponent = (
    props: ProductSummaryProps,
): JSX.Element => {
    function noOfProductOrders(
    ): number {
        return props.productTableList
            .reduce(
                (runningSum: number, current: ProductTable) => runningSum += current.noOfOrders,
                0,
            );
    };

    function totalProductTotalOrderQuantity(
    ): number {
        return props.productTableList
            .reduce(
                (runningSum: number, current: ProductTable) => runningSum += current.totalQuantity,
                0,
            );
    };

    function totalProductTotalOrderAmount(
    ): number {
        return props.productTableList
            .reduce(
                (runningSum: number, current: ProductTable) => runningSum += current.totalAmount,
                0,
            );
    };

    if (hasNoValue(props.products)) {
        return (
            <div className="border-bottom pt-4 py-md-4">
                <Container>
                    <h1 className="my-4">Products</h1>

                    <div className="lead text-center text-muted py-2 mb-5">
                        No Products
                    </div>
                </Container>
            </div>
        );
    };

    return (
        <div className="border-bottom pt-4 py-md-4">
            <Container>
                <h1 className="my-4">Products</h1>

                <div className="table-responsive border rounded mb-5">
                    <Table striped hover className="align-middle mb-0">
                        <colgroup>
                            <col width="3%" />
                            <col />
                            <col />
                            <col />
                            <col />
                        </colgroup>

                        <thead>
                            <tr>
                                <th scope="col" className="text-end">#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col" className="text-end">No of Orders</th>
                                <th scope="col" className="text-end">Total Packets</th>
                                <th scope="col" className="text-end">Total Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                props.productTableList
                                    .map(
                                        (productTable: ProductTable, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="col" className="text-end">{ index + 1 }</th>
                                                    <td scope="col">{ productTable.name }</td>
                                                    <td scope="col" className="text-end">{ productTable.noOfOrders }</td>
                                                    <td scope="col" className="text-end">{ productTable.totalQuantity }</td>
                                                    <td scope="col" className="text-end">{ productTable.totalAmount } ₹</td>
                                                </tr>
                                            );
                                        }
                                    )
                            }
                        </tbody>

                        <tfoot>
                            <tr>
                                <th></th>
                                <th>Grand Total</th>
                                <th className="text-end">{ noOfProductOrders() }</th>
                                <th className="text-end">{ totalProductTotalOrderQuantity() }</th>
                                <th className="text-end">{ totalProductTotalOrderAmount() } ₹</th>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default ProductSummaryComponent;