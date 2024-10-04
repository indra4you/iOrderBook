import {
    useEffect,
    useState,
} from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Table,
} from 'react-bootstrap';

import {
    LoadingTableBodyComponent,
    PageTitleComponent,
} from '../../components';
import {
    DataStatus,
    ProductResponse,
    ServiceProvider,
    useServiceContext,
} from '../../services';
import {
    ProductDeleteComponent,
    ProductFormComponent,
} from './components';

export const ProductListPage = (
): JSX.Element => {
    const serviceProvider: ServiceProvider = useServiceContext()!;

    const [ dataStatus, setDataStatus ] = useState<DataStatus<ProductResponse[]>>({
        isLoading: false,
        error: null,
        data: null,
        hasData: false,
    });
    const [ selectedProduct, setSelectedProduct ] = useState<ProductResponse | null>(null);
    const [ showForm, setShowForm ] = useState<boolean>(false);
    const [ showDelete, setShowDelete ] = useState<boolean>(false);

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

            setDataStatus({
                isLoading: false,
                error: null,
                data: products,
                hasData: products.length > 0,
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

    function onAddProductClicked(
    ): void {
        setShowForm(true);
    };

    function onEditProductClicked(
        product: ProductResponse,
    ): void {
        setSelectedProduct(product);
        setShowForm(true);
    };

    function onDeleteProductClicked(
        product: ProductResponse,
    ): void {
        setSelectedProduct(product);
        setShowDelete(true);
    };

    function onOffcanvasClose(
    ): void {
        setSelectedProduct(null);
        setShowForm(false);
        setShowDelete(false);

        loadData();
    };

    useEffect(
        () => {
            loadData();
        },
        []
    );

    return (
        <div className="pt-4 py-md-4">
            <PageTitleComponent title="Products" />
            
            <Container>
                <h1>
                    <i className="bi bi-receipt me-2"></i>
                    Products

                    {
                        !dataStatus.isLoading &&
                            <button type="button" onClick={onAddProductClicked} className="border-0 bg-transparent text-dark ms-2" title="Add Product">
                                <i className="bi bi-plus-circle-dotted"></i>
                            </button>
                    }
                </h1>

                <div className="table-responsive border rounded mb-3">
                    <Table className="table table-hover table-striped align-middle mb-0">
                        <colgroup>
                            <col width="3%" />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col width="3%" />
                        </colgroup>

                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col" className="text-end">Price</th>
                                <th scope="col" className="text-end">Quantity</th>
                                <th scope="col" className="text-end">Order</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                dataStatus.isLoading &&
                                    <LoadingTableBodyComponent
                                        noOfRows={3}
                                        noOfColumns={6}
                                    />
                            }

                            {
                                !dataStatus.isLoading && !dataStatus.hasData &&
                                    <tr>
                                        <td colSpan={6} className="lead text-center text-muted py-2">
                                            Click
                                            <button type="button" onClick={onAddProductClicked} className="border-0 bg-transparent text-dark" title="Add Product">
                                                <i className="bi bi-plus-circle-dotted"></i>
                                            </button>
                                            to add a product
                                        </td>
                                    </tr>
                            }

                            {
                                !dataStatus.isLoading && dataStatus.hasData &&
                                    dataStatus.data!
                                        .map(
                                            (product: ProductResponse, index: number) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row" className="text-end">{ index + 1 }.</th>
                                                        <td>{ product.name }</td>
                                                        <td className="text-end">{ product.price } ₹</td>
                                                        <td className="text-end">{ product.quantity }</td>
                                                        <td className="text-end">{ product.sort }</td>
                                                        <td className="text-end">
                                                            <ButtonGroup>
                                                                <Button type="button" onClick={() => onEditProductClicked(product)} variant="outline-dark" title="Edit Product">
                                                                    <i className="bi bi-pencil"></i>
                                                                </Button>
                                                                
                                                                {
                                                                    !product.hasOrders &&
                                                                        <Button type="button" onClick={() => onDeleteProductClicked(product)} variant="outline-danger" title="Delete Product">
                                                                            <i className="bi bi-trash3"></i>
                                                                        </Button>
                                                                }
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
            </Container>

            {
                showForm &&
                    <ProductFormComponent
                        product={selectedProduct}
                        onClose={onOffcanvasClose}
                    />
            }

            {
                showDelete &&
                    <ProductDeleteComponent
                        product={selectedProduct!}
                        onClose={onOffcanvasClose}
                    />
            }
        </div>
    );
};

export default ProductListPage;