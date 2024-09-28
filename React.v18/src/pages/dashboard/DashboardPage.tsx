import {
    useEffect,
    useState,
} from 'react';
import {
    useLocation,
} from 'react-router-dom';

import {
    PageTitleComponent,
} from '../../components';
import {
    DataStatus,
} from '../../domains';
import {
    OrderProductResponse,
    OrderResponse,
    ProductModel,
    ProductResponse,
    ServiceProvider,
    useServiceContext,
} from '../../services';
import {
    DashboardData,
    OrderBagesComponent,
    ProductSummaryComponent,
    ProductTable,
    StatisticsComponent,
} from './components';

const useForceUpdate = (
) => {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
};

export const DashboardPage = (
): JSX.Element => {
    const location = useLocation();
    const forceUpdate = useForceUpdate();
    const serviceProvider: ServiceProvider = useServiceContext()!;
    
    const [ dataStatus, setDataStatus ] = useState<DataStatus<DashboardData>>({
        isLoading: false,
        error: null,
        data: null,
        hasData: false,
    });

    async function loadData(
    ): Promise<void> {
        setDataStatus({
            isLoading: true,
            error: null,
            data: null,
            hasData: false,
        });

        try {
            const products: ProductResponse[] = await serviceProvider.products.getAll();
            const orders: OrderResponse[] = await serviceProvider.orders.getAll();
            const productTableList: ProductTable[] = products
                .sort(
                    (a: ProductModel, b: ProductModel) => {
                        if (a.sort < b.sort) {
                            return -1;
                        }
                        
                        if (a.sort > b.sort) {
                            return 1;
                        }
        
                        if (a.name.toLowerCase() < b.name.toLowerCase()) {
                            return -1;
                        }
                        
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return 1;
                        }
        
                        return 0;
                    },
                )
                .map(
                    (product: ProductModel) => {
                        const filteredOrders: OrderResponse[] = orders
                            .filter(
                                (order: OrderResponse) => order.products
                                    .some(
                                        (value: OrderProductResponse) => value.product.id === product.id
                                    )
                            );
        
                        return {
                            name: product.name,
                            noOfOrders: filteredOrders.length,
                            totalQuantity: filteredOrders
                                .reduce(
                                    (runningSum, current) => runningSum += current.totalNumberOfPackets,
                                    0,
                                ),
                            totalAmount: filteredOrders
                                .reduce(
                                    (runningSum, current) => runningSum += current.totalAmount,
                                    0,
                                ),
                        }
                    }
                );
    
            setDataStatus({
                isLoading: false,
                error: null,
                data: {
                    products: products,
                    orders: orders,
                    productTableList: productTableList,
                },
                hasData: true,
            });
        } catch (error) {
            setDataStatus({
                isLoading: false,
                error: error as Error,
                data: null,
                hasData: false,
            });
        }

        forceUpdate();
    };

    useEffect(
        () => {
            loadData();
        },
        [
            location,
        ]
    );
    
    return (
        <section className="container">
            <PageTitleComponent title="Dashboard" />

            {
                dataStatus.isLoading &&
                    <div className="d-flex justify-content-center my-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }

            {
                !dataStatus.isLoading && dataStatus.hasData &&
                    <>
                        <StatisticsComponent
                            products={dataStatus.data!.products}
                            orders={dataStatus.data!.orders}
                            productTableList={dataStatus.data!.productTableList}
                        />

                        <ProductSummaryComponent
                            products={dataStatus.data!.products}
                            orders={dataStatus.data!.orders}
                            productTableList={dataStatus.data!.productTableList}
                        />

                        <OrderBagesComponent
                            orders={dataStatus.data!.orders}
                        />
                    </>
            }
        </section>
    );
};

export default DashboardPage;