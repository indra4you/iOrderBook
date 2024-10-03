import {
    useEffect,
    useState,
} from 'react';
import {
    Alert,
    Breadcrumb,
    Col,
    Container,
    Row,
} from 'react-bootstrap';
import {
    Link,
    NavigateFunction,
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    PageTitleComponent,
} from '../../components';
import {
    DataStatus,
    isNotNullOrEmpty,
    OrderResponse,
    ServiceProvider,
    useServiceContext,
} from '../../services';
import {
    LoadingFormComponent,
    OrderViewComponent,
} from './components';

export const OrderViewPage = (
): JSX.Element => {
    const { id } = useParams();

    const navigate: NavigateFunction = useNavigate();
    const serviceProvider: ServiceProvider = useServiceContext()!;
    
    const [ errorMessage, setErrorMessage ] = useState<string>('');
    const [ dataStatus, setDataStatus ] = useState<DataStatus<OrderResponse>>({
        isLoading: false,
        error: null,
        data: null,
        hasData: false,
    });

    function hasValidId(
    ): boolean {
        return isNotNullOrEmpty(id);
    };

    function hasError(
    ): boolean {
        return isNotNullOrEmpty(errorMessage);
    };

    async function loadData(
    ): Promise<void> {
        if (!hasValidId()) {
            navigate('/orders');
        }

        setDataStatus({
            isLoading: true,
            error: null,
            data: null,
            hasData: false,
        });

        try {
            const order: OrderResponse = await serviceProvider.orders.getById(+id!);

            setDataStatus({
                isLoading: false,
                error: null,
                data: order,
                hasData: order !== null,
            });
        } catch (error) {
            const err: Error = error as Error;
            setErrorMessage(err.message);
            setDataStatus({
                isLoading: false,
                error: err,
                data: null,
                hasData: false,
            });
        }
    };

    useEffect(
        () => {
            loadData();
        },
        [
            id,
        ]
    );

    return (
        <div className="pt-4 py-md-4">
            <PageTitleComponent title="View Order" />

            <Container>
                <Breadcrumb className="h1">
                    <Breadcrumb.Item>
                        <Link to="/orders" title="Go back to Orders">
                            <i className="bi bi-postcard"></i>
                            <span className="ms-2">Orders</span>
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item active>
                        <i className="bi bi-binoculars"></i>
                        <span className="mx-2">#{ id }</span>
                    </Breadcrumb.Item>
                </Breadcrumb>

                {
                    hasError() &&
                        <Row>
                            <Col xs="1" md="3"></Col>

                            <Col xs="10" md="6">
                                <Alert variant="danger">
                                    <i className='bi bi-patch-exclamation me-3'></i>
                                    { errorMessage }
                                </Alert>
                            </Col>

                            <Col xs="1" md="3"></Col>
                        </Row>
                }

                {
                    dataStatus.isLoading &&
                        <LoadingFormComponent />
                }

                {
                    !dataStatus.isLoading && dataStatus.hasData &&
                        <OrderViewComponent
                            order={dataStatus.data!}
                        />
                }
            </Container>
        </div>
    );
};

export default OrderViewPage;