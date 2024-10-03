import {
    useEffect,
    useState,
} from 'react';
import {
    Alert,
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
    isNotNullOrEmpty,
    ProductRequest,
    ProductResponse,
    ServiceProvider,
    useServiceContext,
} from '../../../services';

type ProductForm = {
    name: string | null,
    price: number | null,
    quantity: number | null,
    sort: number | null,
};

type ProductFormProps = {
    product: ProductResponse | null,
    onClose: () => void,
};

export const ProductFormComponent = (
    props: ProductFormProps
): JSX.Element => {
    const serviceProvider: ServiceProvider = useServiceContext()!;
    
    const [ errorMessage, setErrorMessage ] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: {
            isDirty,
            isSubmitting,
            isLoading,
            isValid,
            errors,
        },
        setFocus,
        trigger,
    } = useForm<ProductForm>({
        mode: 'all',
        defaultValues: {
            name: props.product?.name,
            price: props.product?.price,
            quantity: props.product?.quantity ?? 500,
            sort: props.product?.sort ?? 100,
        }
    });

    function hasValidProduct(
    ): boolean {
        return props.product !== null;
    };

    function hasError(
    ): boolean {
        return isNotNullOrEmpty(errorMessage);
    };

    useEffect(
        () => {
            const asyncUseEffect = async (): Promise<void> => {
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

    function onCancelClicked(
    ): void {
        props.onClose();
    };

    async function onSubmitClicked(
        fieldValues: FieldValues,
    ): Promise<void> {
        try {
            const request: ProductRequest = {
                name: fieldValues.name,
                quantity: fieldValues.quantity,
                price: fieldValues.price,
                sort: fieldValues.sort,
            };

            if (hasValidProduct()) {
                await serviceProvider.products.modify(props.product!.id, request);
            } else {
                await serviceProvider.products.add(request);
            }
            
            props.onClose();
        } catch (error) {
            const err: Error = error as Error;
            setErrorMessage(err.message);
        }
    };

    return (
        <Offcanvas show={true} onHide={onCancelClicked} placement="end">
            <Offcanvas.Header className="text-bg-dark">
                <Offcanvas.Title>
                    <i className="bi bi-receipt me-2"></i>

                    {
                        hasValidProduct() &&
                            <span className="me-2">Edit</span>
                    }
                    
                    {
                        !hasValidProduct() &&
                            <span className="me-2">Add</span>
                    }

                    Product
                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                {
                    isLoading &&
                        <LoadingFormComponent
                            noOfFields={4}
                        />
                }

                {
                    hasError() &&
                        <Alert variant="danger">
                            <i className="bi bi-patch-exclamation me-3"></i>
                            { errorMessage }
                        </Alert>
                }

                {
                    !isLoading &&
                        <form onSubmit={handleSubmit(onSubmitClicked)}>
                            <fieldset>
                                <div className="mb-3">
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

                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>

                                    <div className="input-group has-validation">
                                        <input type="number" id="price" inputMode="numeric" min="1"
                                            className={`form-control ${errors.price ? 'is-invalid' : 'is-valid'}`}
                                            {
                                                ...register(
                                                    'price', {
                                                        required: {
                                                            value: true,
                                                            message: 'Price is required',
                                                        },
                                                        min: {
                                                            value: 10,
                                                            message: 'Price should be between 10 and 2000',
                                                        },
                                                        max: {
                                                            value: 2000,
                                                            message: 'Price should be between 10 and 2000',
                                                        },
                                                        valueAsNumber: true,
                                                    }
                                                )
                                            } />
                                        
                                        <span className="input-group-text">₹</span>

                                        {
                                            errors.price && (
                                                <div className="invalid-feedback">
                                                    { errors.price.message }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">Quantity</label>

                                    <div className="input-group has-validation">
                                        <input type="number" id="quantity" inputMode="numeric" min="10"
                                            className={`form-control ${errors.quantity ? 'is-invalid' : 'is-valid'}`}
                                            {
                                                ...register(
                                                    'quantity', {
                                                        required: {
                                                            value: true,
                                                            message: 'Quantity is required',
                                                        },
                                                        min: {
                                                            value: 10,
                                                            message: 'Quantity should be between 10 and 1000',
                                                        },
                                                        max: {
                                                            value: 1000,
                                                            message: 'Quantity should be between 10 and 1000',
                                                        },
                                                        valueAsNumber: true,
                                                    }
                                                )
                                            } />
                                        
                                        <span className="input-group-text">grams</span>

                                        {
                                            errors.quantity && (
                                                <div className="invalid-feedback">
                                                    { errors.quantity.message }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="sort" className="form-label">Order</label>

                                    <input type="number" id="sort" inputMode="numeric" min="100" step="10"
                                        className={`form-control ${errors.sort ? 'is-invalid' : 'is-valid'}`}
                                        {
                                            ...register(
                                                'sort', {
                                                    required: {
                                                        value: true,
                                                        message: 'Order is required',
                                                    },
                                                    min: {
                                                        value: 10,
                                                        message: 'Order should be between 100 and 2000',
                                                    },
                                                    max: {
                                                        value: 1000,
                                                        message: 'Order should be between 100 and 2000',
                                                    },
                                                    valueAsNumber: true,
                                                }
                                            )
                                        } />
                                    
                                    {
                                        errors.sort && (
                                            <div className="invalid-feedback">
                                                { errors.sort.message }
                                            </div>
                                        )
                                    }
                                </div>
                            </fieldset>

                            <Button type="submit" disabled={!isDirty || !isValid || isSubmitting} variant="dark" title="Save Product">
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

                            <Button type="reset" onClick={onCancelClicked} disabled={isSubmitting} variant="outline-secondary" className="ms-2" title="Go back to Products">
                                <i className="bi bi-x-lg"></i>
                                <span className="ms-2">Cancel</span>
                            </Button>
                        </form>
                }
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ProductFormComponent;