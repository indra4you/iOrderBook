import {
    useEffect,
    useState,
} from 'react';
import {
    Button,
    Offcanvas,
} from 'react-bootstrap';
import {
    FieldValues,
    useForm,
} from 'react-hook-form';

import {
    LoadingFormComponent,
} from '../../../components';
import {
    OrderProductResponse,
    ProductResponse,
    ServiceProvider,
    useServiceContext,
} from '../../../services';

type OrderProductForm = {
    productId: string | null,
    numberOfPackets: number | null,
};

type OrderProductFormProps = {
    orderProduct: OrderProductResponse | null,
    onClose: (orderProduct: OrderProductResponse | null) => void,
};

export const OrderProductFormComponent = (
    props: OrderProductFormProps,
): JSX.Element => {
    const serviceProvider: ServiceProvider = useServiceContext()!;

    const [ products, setProducts ] = useState<ProductResponse[]>([]);

    const {
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
    } = useForm<OrderProductForm>({
        mode: 'all',
        defaultValues: {
            productId: null,
            numberOfPackets: 1,
        }
    });

    function hasValidOrderProduct(
    ): boolean {
        return null !== props.orderProduct;
    };

    useEffect(
        () => {
            const asyncUseEffect = async (): Promise<void> => {
                const products: ProductResponse[] = await serviceProvider.products.getAll();
                setProducts(products);

                if (hasValidOrderProduct()) {
                    setValue(
                        'productId',
                        props.orderProduct!.product.id, {
                            shouldValidate: true,
                        }
                    );
                    setValue(
                        'numberOfPackets',
                        props.orderProduct!.numberOfPackets, {
                            shouldValidate: true,
                        }
                    );
                }

                await trigger();

                setFocus('productId');
            };

            asyncUseEffect();
        },
        [
            setFocus,
            trigger,
        ]
    );

    function onCancelClicked(
    ): void {
        props.onClose(null);
    };

    function onSubmitClicked(
        fieldValues: FieldValues,
    ): void {
        const selectedProductId: string = fieldValues.productId;
        const numberOfPackets: number = fieldValues.numberOfPackets;
        const product: ProductResponse = products
            .findLast(
                (value) => value.id === selectedProductId!
            )!;
        const orderProduct: OrderProductResponse = {
            product: product,
            numberOfPackets: numberOfPackets,
            amount: numberOfPackets * product.price,
        };

        props.onClose(orderProduct);
    };

    return (
        <Offcanvas show={true} onHide={onCancelClicked} placement="end">
            <Offcanvas.Header className="text-bg-dark">
                <Offcanvas.Title>
                    <i className="bi bi-receipt me-2"></i>

                    {
                        hasValidOrderProduct() &&
                            <span className="me-2">Edit</span>
                    }

                    {
                        !hasValidOrderProduct() &&
                            <span className="me-2">Add</span>
                    }

                    Product
                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                {
                    isLoading &&
                        <LoadingFormComponent noOfFields={4} />
                }

                {
                    !isLoading &&
                        <form onSubmit={handleSubmit(onSubmitClicked)}>
                            <fieldset>
                                <div className="mb-3">
                                    <label htmlFor="productId" className="form-label">Product</label>

                                    <select id="productId"
                                        className={`form-control ${errors.productId ? 'is-invalid' : 'is-valid'}`}
                                        {
                                            ...register(
                                                `productId`, {
                                                    required: {
                                                        value: true,
                                                        message: 'Product is required',
                                                    },
                                                }
                                            )
                                        }>

                                        {
                                            !hasValidOrderProduct() &&
                                                <option value="" disabled>--- Select Product ---</option>
                                        }

                                        {
                                            products
                                                .map(
                                                    (product: ProductResponse) => {
                                                        return (
                                                            <option key={product.id} value={product.id}>{ product.name }</option>
                                                        );
                                                    }
                                                )
                                        }
                                    </select>
                                    
                                    {
                                        errors.productId && (
                                            <div className="invalid-feedback">
                                                { errors.productId.message }
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="numberOfPackets" className="form-label">Number of Packets</label>

                                    <input type="number" id="numberOfPackets" inputMode="numeric" min="1"
                                        className={`form-control ${errors.numberOfPackets ? 'is-invalid' : 'is-valid'}`}
                                        {
                                            ...register(
                                                'numberOfPackets', {
                                                    required: {
                                                        value: true,
                                                        message: 'Number of Packets is required',
                                                    },
                                                    min: {
                                                        value: 1,
                                                        message: 'Number of Packets should be at least 1',
                                                    },
                                                    valueAsNumber: true,
                                                }
                                            )
                                        } />

                                    {
                                        errors.numberOfPackets && (
                                            <div className="invalid-feedback">
                                                { errors.numberOfPackets.message }
                                            </div>
                                        )
                                    }
                                </div>
                            </fieldset>

                            <Button type="submit" disabled={!isDirty || !isValid || isSubmitting} variant="dark">
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

                            <Button type="reset" onClick={onCancelClicked} disabled={isSubmitting} variant="outline-secondary" className="ms-2">
                                <i className="bi bi-x-lg"></i>
                                <span className="ms-2">Cancel</span>
                            </Button>
                        </form>
                }
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default OrderProductFormComponent;