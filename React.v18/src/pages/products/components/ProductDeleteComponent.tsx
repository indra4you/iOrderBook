import {
    useState,
} from 'react';
import {
    Alert,
    Button,
    Form,
    Offcanvas,
    Spinner,
} from 'react-bootstrap';

import {
    isNotNullOrEmpty,
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
        <Offcanvas show={true} onHide={onCancelClicked} placement="end">
            <Offcanvas.Header className="text-bg-danger">
                <Offcanvas.Title>
                    <i className="bi bi-receipt me-2"></i>
                    Delete Product
                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <Alert variant="danger">
                    <i className={`bi bi-patch-question me-3`}></i>
                    Are you sure you want to delete Product?
                </Alert>

                {
                    hasError() &&
                        <Alert variant="danger">
                            <i className="bi bi-patch-exclamation me-3"></i>
                            { errorMessage }
                        </Alert>
                }

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold mb-0">Name</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={ props.product.name } />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold mb-0">Price</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={`${props.product.price} ₹`} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold mb-0">Quantity</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={`${props.product.price} grams`} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold mb-0">Order</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={props.product.sort} />
                    </Form.Group>
                </Form>

                <Button type="submit" onClick={onDeleteClicked} variant="danger" disabled={isSubmitted} title="Delete Product">
                    {
                        isSubmitted &&
                            <Spinner animation="border" size="sm">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                    }
                    {
                        !isSubmitted &&
                            <i className="bi bi-trash3"></i>
                    }

                    <span className="ms-2">Delete</span>
                </Button>

                <Button type="reset" onClick={onCancelClicked} variant="outline-secondary" className="ms-2" title="Go back to Products">
                    <i className="bi bi-x-lg"></i>
                    <span className="ms-2">Cancel</span>
                </Button>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ProductDeleteComponent;