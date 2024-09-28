import {
    useState,
} from 'react';

import {
    AlertComponent,
} from '../../../components';
import {
    isNotNullOrEmpty,
} from '../../../Extensions';
import {
    ProductResponse,
    ServiceProvider,
    useServiceContext,
} from '../../../services';

type ProductDeleteProps = {
    product: ProductResponse,
    onClose: () => void,
};

export const ProductDeleteComponent = (
    props: ProductDeleteProps
): JSX.Element => {
    const serviceProvider: ServiceProvider = useServiceContext()!;
    
    const [ errorMessage, setErrorMessage ] = useState<string>('');
    const [ isSubmitted, setIsSubmitted ] = useState<boolean>(false);

    function hasError(
    ): boolean {
        return isNotNullOrEmpty(errorMessage);
    }

    function onCancelClicked(
    ): void {
        props.onClose();
    };

    async function onDeleteClicked(
    ): Promise<void> {
        setIsSubmitted(true);

        try {
            await serviceProvider.products.delete(props.product.id);

            props.onClose();
        } catch (error) {
            const err: Error = error as Error;
            setErrorMessage(err.message);
            setIsSubmitted(false);
        }
    };

    return (
        <>
            <div className="offcanvas offcanvas-end show" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="offcanvas-header text-bg-primary">
                    <h5 className="offcanvas-title">Delete Product</h5>
                </div>

                <div className="offcanvas-body">
                    <AlertComponent
                        message="Are you sure you want to delete Product?"
                        icon="question"
                        type="danger"
                        onOffcanvas={true} />

                    {
                        hasError() &&
                            <div className="alert alert-danger" role="alert">
                                <div className="row">
                                    <div className="col-1">
                                        <i className="bi bi-patch-exclamation"></i>
                                    </div>
                                    
                                    <div className="col-11">
                                        { errorMessage }
                                    </div>
                                </div>
                            </div>
                    }

                    <div className="mb-3">
                        <label className="fw-bold">Name</label>

                        <span className="form-control-plaintext">{ props.product.name }</span>
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Price</label>

                        <span className="form-control-plaintext">{ props.product.price } ₹</span>
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Quantity</label>

                        <span className="form-control-plaintext">{ props.product.quantity } grams</span>
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Order</label>

                        <span className="form-control-plaintext">{ props.product.sort }</span>
                    </div>

                    <button type="submit" onClick={onDeleteClicked} disabled={isSubmitted} className="btn btn-danger" title="Delete Product">
                        {
                            isSubmitted &&
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                        }
                        {
                            !isSubmitted &&
                                <i className="bi bi-trash3"></i>
                        }

                        <span className="ms-2">Delete</span>
                    </button>

                    <button type="reset" onClick={onCancelClicked} disabled={isSubmitted} className="btn btn-outline-secondary ms-2" title="Go back to Products">
                        <i className="bi bi-x-lg"></i>
                        <span className="ms-2">Cancel</span>
                    </button>
                </div>
            </div>

            <div className="offcanvas-backdrop fade show"></div>
        </>
    );
};

export default ProductDeleteComponent;