import {
    useEffect,
    useState,
} from 'react';
import {
    Alert,
    Breadcrumb,
    Button,
    ButtonGroup,
    Col,
    Container,
    Row,
    Table,
} from 'react-bootstrap';
import {
    FieldArrayWithId,
    FieldValues,
    useFieldArray,
    useForm,
} from 'react-hook-form';
import {
    NavigateFunction,
    useNavigate,
} from 'react-router';
import {
    Link,
    useParams,
} from 'react-router-dom';

import {
    PageTitleComponent,
} from '../../components';
import {
    isNotNullOrEmpty,
    OrderProductResponse,
    OrderRequest,
    OrderResponse,
    ServiceProvider,
    useServiceContext,
} from '../../services';
import {
    LoadingFormComponent,
    OrderProductDeleteComponent,
    OrderProductFormComponent,
} from './components';

export type OrderForm = {
    name: string | null,
    mobileNumber: number | null,
    products: OrderProductResponse[],
};

export const OrderFormPage = (
): JSX.Element => {
    const { id } = useParams();
    
    const navigate: NavigateFunction = useNavigate();
    const serviceProvider: ServiceProvider = useServiceContext()!;

    const [ errorMessage, setErrorMessage ] = useState<string>('');
    const [ showForm, setShowForm ] = useState<boolean>(false);
    const [ showDelete, setShowDelete ] = useState<boolean>(false);
    const [ selectedOrderProduct, setSelectOrderProduct ] = useState<OrderProductResponse | null>(null);
    const [ selectedOrderProductIndex, setSelectOrderProductIndex ] = useState<number | null>(null);

    const {
        control,
        register,
        handleSubmit,
        formState: {
            isDirty,
            isLoading,
            isSubmitting,
            isValid,
            errors,
        },
        setFocus,
        trigger,
        setValue,
    } = useForm<OrderForm>({
        mode: 'all',
        defaultValues: {
            name: null,
            mobileNumber: null,
            products: [],
        }
    });
    const {
        fields,
        append,
        update,
        remove,
    } = useFieldArray({
        name: 'products',
        control,
        rules: {
            required: true,
            minLength: 1,
        }
    });

    function hasValidId(
    ): boolean {
        return isNotNullOrEmpty(id);
    };

    function hasError(
    ): boolean {
        return isNotNullOrEmpty(errorMessage);
    };

    useEffect(
        () => {
            const asyncUseEffect = async (): Promise<void> => {
                if (hasValidId()) {
                    try {
                        const order: OrderResponse = await serviceProvider.orders.getById(+id!);

                        setValue(
                            'name',
                            order.name, {
                                shouldValidate: true,
                            }
                        );
                        setValue(
                            'mobileNumber',
                            +order.mobileNumber, {
                                shouldValidate: true,
                            }
                        );
                        setValue(
                            'products',
                            order.products, {
                                shouldValidate: true,
                            }
                        );
                    } catch (error) {
                        const err: Error = error as Error;
                        setErrorMessage(err.message);
                    }
                }

                await trigger();

                setFocus("name");
            };

            asyncUseEffect();
        },
        [
            setFocus,
            trigger,
        ]
    );

    function onAddOrderProductClicked(
    ): void {
        setSelectOrderProductIndex(null);
        setSelectOrderProduct(null);
        setShowForm(true);
    };

    function onEditOrderProductClicked(
        index: number,
        orderProduct: OrderProductResponse,
    ): void {
        setSelectOrderProductIndex(index);
        setSelectOrderProduct(orderProduct);
        setShowForm(true);
    };

    function onFormClosed(
        orderProduct: OrderProductResponse | null,
    ): void {
        if (null !== orderProduct) {
            if (null === selectedOrderProductIndex) {
                append(orderProduct);
            } else {
                update(selectedOrderProductIndex!, orderProduct);
            }
        }

        setShowForm(false);
        setSelectOrderProductIndex(null);
        setSelectOrderProduct(null);
    };

    function onDeleteOrderProductClicked(
        index: number,
        orderProduct: OrderProductResponse,
    ): void {
        setSelectOrderProductIndex(index);
        setSelectOrderProduct(orderProduct);
        setShowDelete(true);
    };

    function onDeleteClosed(
        deleteIt: boolean,
    ): void {
        if (deleteIt) {
            remove(selectedOrderProductIndex!);
        }

        setSelectOrderProductIndex(null);
        setSelectOrderProduct(null);
        setShowDelete(false);
    };

    async function onSubmitClicked(
        fieldValues: FieldValues,
    ): Promise<void> {
        try {
            const request: OrderRequest = {
                name: fieldValues.name,
                mobileNumber: fieldValues.mobileNumber,
                products: fieldValues.products
                    .map(
                        (value: OrderProductResponse) => {
                            return {
                                productId: value.product.id,
                                numberOfPackets: value.numberOfPackets,
                            };
                        }
                    ),
            };

            if (hasValidId()) {
                await serviceProvider.orders.modify(+id!, request);
            } else {
                await serviceProvider.orders.add(request);
            }

            navigate('/orders');
        } catch (error) {
            const err: Error = error as Error;
            setErrorMessage(err.message);
        }
    };

    return (
        <div className="pt-4 py-md-4">
            <PageTitleComponent title={hasValidId() ? "Edit Order" : "Add Order"} />

            <Container>
                <Breadcrumb className="h1">
                    <Breadcrumb.Item>
                        <Link to="/orders" title="Go back to Orders">
                            <i className="bi bi-postcard"></i>
                            <span className="ms-2">Orders</span>
                        </Link>
                    </Breadcrumb.Item>

                    {
                        hasValidId() &&
                            <>
                                <Breadcrumb.Item>
                                    <Link  to={`/orders/${id}`} title="View Orders">
                                        <i className="bi bi-binoculars"></i>
                                        <span className="mx-2">#{ id }</span>
                                    </Link>
                                </Breadcrumb.Item>

                                <Breadcrumb.Item active>
                                    <i className="bi bi-pencil"></i>
                                    <span className="mx-2">Edit</span>
                                </Breadcrumb.Item>
                            </>
                    }

                    {
                        !hasValidId() &&
                            <Breadcrumb.Item active>
                                <i className="bi bi-plus-circle-dotted"></i>
                                <span className="mx-2">Add</span>
                            </Breadcrumb.Item>
                    }
                </Breadcrumb>

                {
                    isLoading &&
                        <LoadingFormComponent />
                }

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
                    !isLoading &&
                        <form onSubmit={handleSubmit(onSubmitClicked)} className="mb-3">
                            <fieldset>
                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>

                                        <input type="text" id="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : 'is-valid'}`}
                                            {
                                                ...register(
                                                    'name', {
                                                        required: {
                                                            value: true,
                                                            message: 'Name is required',
                                                        },
                                                        minLength: {
                                                            value: 3,
                                                            message: 'Name at least should be 3 characters',
                                                        },
                                                    }
                                                )
                                            } />
                                        
                                        {
                                            errors.name && (
                                                <div className="invalid-feedback">
                                                    { errors.name.message }
                                                </div>
                                            )
                                        }
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>

                                        <input type="number" id="mobileNumber" inputMode="tel"
                                            className={`form-control ${errors.mobileNumber ? 'is-invalid' : 'is-valid'}`}
                                            {
                                                ...register(
                                                    'mobileNumber', {
                                                        required: {
                                                            value: true,
                                                            message: 'Mobile Number is required',
                                                        },
                                                        min: {
                                                            value: 1000000000,
                                                            message: 'Mobile Number should be 10 digits',
                                                        },
                                                        max: {
                                                            value: 9999999999,
                                                            message: 'Mobile Number should be 10 digits',
                                                        },
                                                        valueAsNumber: true,
                                                    }
                                                )
                                            } />

                                        {
                                            errors.mobileNumber && (
                                                <div className="invalid-feedback">
                                                    { errors.mobileNumber.message }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                                <h3 className="mt-3">
                                    Products

                                    <button type="button" onClick={onAddOrderProductClicked} className="border-0 bg-transparent text-dark ms-2" title="Add Product">
                                        <i className="bi bi-plus-circle-dotted"></i>
                                    </button>
                                </h3>

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
                                                <th scope="col"></th>
                                                <th scope="col">Product</th>
                                                <th scope="col" className="text-end">Quantity</th>
                                                <th scope="col" className="text-end">Price</th>
                                                <th scope="col" className="text-end">No of Packets</th>
                                                <th scope="col" className="text-end">Amount</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                fields.length === 0 &&
                                                    <tr>
                                                        <td colSpan={7} className="lead text-center text-muted py-2">
                                                            Click
                                                            <button type="button" onClick={onAddOrderProductClicked} className="border-0 bg-transparent text-dark" title="Add Product">
                                                                <i className="bi bi-plus-circle-dotted"></i>
                                                            </button>
                                                            to add a product
                                                        </td>
                                                    </tr>
                                            }

                                            {
                                                fields.length > 0 &&
                                                    fields
                                                        .map((field: FieldArrayWithId<OrderForm, "products", "id">, index: number) => {
                                                            return (
                                                                <tr key={field.id}>
                                                                    <th scope="row" className="text-end">{ index + 1 }.</th>
                                                                    <td>{ field.product.name }</td>
                                                                    <td className="text-end">{ field.product.quantity } grams</td>
                                                                    <td className="text-end">{ field.product.price } ₹</td>
                                                                    <td className="text-end">{ field.numberOfPackets }</td>
                                                                    <td className="text-end">{ field.amount } ₹</td>
                                                                    <td className="text-end">
                                                                        <ButtonGroup>
                                                                            <Button type="button" onClick={() => onEditOrderProductClicked(index, field)} variant="outline-dark" title="Edit Product">
                                                                                <i className="bi bi-pencil"></i>
                                                                            </Button>
                                                                            
                                                                            <Button type="button" onClick={() => onDeleteOrderProductClicked(index, field)} variant="outline-danger" title="Delete Product">
                                                                                <i className="bi bi-trash3"></i>
                                                                            </Button>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </fieldset>

                            <Button type="submit" disabled={!isDirty || !isValid || isSubmitting} variant="dark" title="Save Order">
                                {
                                    isSubmitting &&
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                }

                                {
                                    !isSubmitting &&
                                        <i className="bi bi-hdd"></i>
                                }

                                <span className="ms-2">Save</span>
                            </Button>

                            <Link to="/orders" className="btn btn-outline-secondary ms-2" title="Go back to Orders">
                                <i className="bi bi-x-lg"></i>
                                <span className="ms-2">Cancel</span>
                            </Link>
                        </form>
                }
            </Container>

            {
                showForm &&
                    <OrderProductFormComponent orderProduct={selectedOrderProduct} onClose={onFormClosed} />
            }

            {
                showDelete &&
                    <OrderProductDeleteComponent orderProduct={selectedOrderProduct!} onClose={onDeleteClosed} />
            }
        </div>
    );
};

export default OrderFormPage;