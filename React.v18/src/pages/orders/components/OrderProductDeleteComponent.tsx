import {
    Alert,
    Button,
    Form,
    Offcanvas,
} from 'react-bootstrap';

import {
    OrderProductResponse,
} from '../../../services';

type OrderProductDeleteProps = {
    orderProduct: OrderProductResponse,
    onClose: (deleteIt: boolean) => void,
};

export const OrderProductDeleteComponent = (
    props: OrderProductDeleteProps
): JSX.Element => {
    function onCancelClicked(
    ): void {
        props.onClose(false);
    };

    function onDeleteClicked(
    ): void {
        props.onClose(true);
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

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold mb-0">Name</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={ props.orderProduct.product.name } />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold mb-0">Number of Packets</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={ props.orderProduct.numberOfPackets } />
                    </Form.Group>
                </Form>

                <Button type="submit" onClick={onDeleteClicked} variant="danger" title="Delete Product">
                    <i className="bi bi-trash3"></i>
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

export default OrderProductDeleteComponent;