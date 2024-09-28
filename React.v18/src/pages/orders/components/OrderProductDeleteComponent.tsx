import {
    AlertComponent,
} from '../../../components';
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

                    <div className="mb-3">
                        <label className="fw-bold">Name</label>

                        <span className="form-control-plaintext">{ props.orderProduct.product.name }</span>
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Number of Packets</label>

                        <span className="form-control-plaintext">{ props.orderProduct.numberOfPackets }</span>
                    </div>

                    <button type="submit" onClick={onDeleteClicked} className="btn btn-danger" title="Delete Product">
                        <i className="bi bi-trash3"></i>
                        <span className="ms-2">Delete</span>
                    </button>

                    <button type="reset" onClick={onCancelClicked} className="btn btn-outline-secondary ms-2" title="Go back to Products">
                        <i className="bi bi-x-lg"></i>
                        <span className="ms-2">Cancel</span>
                    </button>
                </div>
            </div>

            <div className="offcanvas-backdrop fade show"></div>
        </>
    );
};

export default OrderProductDeleteComponent;