import {
    useEffect,
    useState,
} from 'react';
import {
    Link,
    NavigateFunction,
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    AlertComponent,
    PageTitleComponent,
} from '../../components';
import {
    DataStatus,
} from '../../domains';
import {
    isNotNullOrEmpty,
} from '../../Extensions';
import {
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
        <>
            <PageTitleComponent title="View Order" />

            <section className="container">
                <h1 className="my-3" aria-label="breadcrumb">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/orders" title="Go back to Orders">Orders</Link>
                        </li>

                        <li className="breadcrumb-item active" aria-current="page">
                            <span className="me-2">#{ id }</span>
                        </li>
                    </ul>
                </h1>

                {
                    hasError() &&
                        <AlertComponent
                            message={errorMessage}
                            icon="exclamation"
                            type="danger"
                            onOffcanvas={false} />
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
            </section>
        </>
    );
};

export default OrderViewPage;