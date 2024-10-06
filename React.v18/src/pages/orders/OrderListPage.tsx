import {
    useEffect,
    useState,
} from 'react';
import {
    Alert,
    AlertHeading,
    ButtonGroup,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Row,
    Table,
} from 'react-bootstrap';
import {
    Link,
} from 'react-router-dom';

import {
    LoadingTableBodyComponent,
    PageTitleComponent,
} from '../../components';
import {
    DataStatus,
    OrderResponse,
    OrderStatus,
    ProductResponse,
    ServiceProvider,
    useServiceContext,
} from '../../services';

// TODO: Change Order Status from "Saved" to "Delievered"

export const OrderListPage = (
): JSX.Element => {
    const serviceProvider: ServiceProvider = useServiceContext()!;

    const [ hasProducts, setHasProducts ] = useState<boolean>(true);
    const [ dataStatus, setDataStatus ] = useState<DataStatus<OrderResponse[]>>({
        isLoading: false,
        error: null,
        data: null,
        hasData: false,
    });

    async function loadData(
    ): Promise<void> {
        setHasProducts(true);
        setDataStatus({
            isLoading: true,
            error: null,
            data: null,
            hasData: false,
        });

        try {
            const products: ProductResponse[] = await serviceProvider.products.getAll();
            const orders: OrderResponse[] = await serviceProvider.orders.getAll();

            setHasProducts(products.length > 0);
            setDataStatus({
                isLoading: false,
                error: null,
                data: orders,
                hasData: orders.length > 0,
            });
        } catch (error) {
            setDataStatus({
                isLoading: false,
                error: error as Error,
                data: null,
                hasData: false,
            });
        }
    };

    function getOrderStatusClass(
        orderStatus: OrderStatus,
    ): string {
        switch (orderStatus) {
            case OrderStatus.InProgress:
                return 'bg-status-in-progress';
            case OrderStatus.Saved:
                return 'bg-status-saved';
            case OrderStatus.Delivered:
                return 'bg-status-delivered';
        }
    };

    function getOrderStatusText(
        orderStatus: OrderStatus,
    ): string {
        return OrderStatus.toString(orderStatus);
    };

    function canEdit(
        orderStatus: OrderStatus,
    ): boolean {
        return orderStatus < OrderStatus.Delivered;
    };

    useEffect(
        () => {
            loadData();
        },
        []
    );

    return (
        <div className="pt-4 py-md-4">
            <PageTitleComponent title="Orders" />

            <Container>
                {
                    !hasProducts &&
                        <>
                            <h1>
                                <i className="bi bi-postcard me-2"></i>
                                Orders
                            </h1>

                            <Row>
                                <Col xs="1" md="4"></Col>

                                <Col xs="10" md="4">
                                    <Alert variant="warning">
                                        <AlertHeading>
                                            <i className="bi bi-patch-exclamation me-2"></i> No Products
                                        </AlertHeading>

                                        <hr />

                                        <p className="mb-0">Create few products by clicking <Link to="/products" className="alert-link">here</Link>.</p>
                                    </Alert>
                                </Col>

                                <Col xs="1" md="4"></Col>
                            </Row>
                        </>
                }

                {
                    hasProducts &&
                        <>
                            <h1>
                                <i className="bi bi-postcard me-2"></i>
                                Orders

                                {
                                    !dataStatus.isLoading &&
                                        <Link to="/orders/add" className="text-dark ms-3" title="Add Order">
                                            <i className="bi bi-plus-circle-dotted"></i>
                                        </Link>
                                }
                            </h1>

                            <div className="table-responsive border rounded mb-3">
                                <Table striped hover className="align-middle mb-0">
                                    <colgroup>
                                        <col width="3%" />
                                        <col />
                                        <col />
                                        <col />
                                        <col />
                                        <col />
                                        <col width="3%" />
                                    </colgroup>

                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-end">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col" className="text-end">Mobile</th>
                                            <th scope="col" className="text-end">Total Packets</th>
                                            <th scope="col" className="text-end">Total Amount</th>
                                            <th scope="col">Status</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            dataStatus.isLoading &&
                                                <LoadingTableBodyComponent
                                                    noOfRows={3}
                                                    noOfColumns={7}
                                                />
                                        }

                                        {
                                            !dataStatus.isLoading && !dataStatus.hasData &&
                                                <tr>
                                                    <td colSpan={7} className="lead text-center text-muted py-2">
                                                        Click
                                                        <Link to="/orders/add" className="text-dark mx-2" title="Add Order">
                                                            <i className="bi bi-plus-circle-dotted"></i>
                                                        </Link>
                                                        to add a order
                                                    </td>
                                                </tr>
                                        }

                                        {
                                            !dataStatus.isLoading && dataStatus.hasData &&
                                                dataStatus.data!
                                                    .map(
                                                        (order: OrderResponse, index: number) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <th scope="row" className="text-end">{ order.id }.</th>
                                                                    <td>{ order.name }</td>
                                                                    <td className="text-end">{ order.mobileNumber }</td>
                                                                    <td className="text-end">{ order.totalNumberOfPackets }</td>
                                                                    <td className="text-end">{ order.totalAmount } ₹</td>
                                                                    <td>
                                                                        <span className={`border rounded-pill py-1 px-2 font-monospace fw-light fs-6 ${getOrderStatusClass(order.status)}`}>
                                                                            { getOrderStatusText(order.status) }
                                                                        </span>
                                                                    </td>
                                                                    <td className="text-end">
                                                                        <ButtonGroup>
                                                                            {
                                                                                canEdit(order.status) &&
                                                                                    <>
                                                                                        <Link to={`/orders/${order.id}/edit`} className="btn btn-outline-dark" title="Edit Order">
                                                                                            <i className="bi bi-pencil"></i>
                                                                                        </Link>
                                                                                    </>
                                                                            }

                                                                            <DropdownButton as={ButtonGroup} title="" variant="outline-secondary">
                                                                                <Dropdown.Item as={Link} to={`/orders/${order.id}`} title="View Order">
                                                                                    <i className="bi bi-binoculars me-2"></i>
                                                                                    View Order
                                                                                </Dropdown.Item>

                                                                                {
                                                                                    canEdit(order.status) &&
                                                                                        <>
                                                                                            <Dropdown.Item as={Link} to={`/orders/${order.id}/delete`} className="text-danger" title="Delete Order">
                                                                                                <i className="bi bi-trash3 me-2"></i>
                                                                                                Delete Order
                                                                                            </Dropdown.Item>
                                                                                        </>
                                                                                }
                                                                            </DropdownButton>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </>
                }
            </Container>
        </div>
    );
};

export default OrderListPage;