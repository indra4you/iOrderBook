type AlertProps = {
    message: string,
    icon: 'question' | 'exclamation',
    type: 'danger',
    onOffcanvas: boolean,
};

export const AlertComponent = (
    props: AlertProps,
): JSX.Element => {
    if (props.onOffcanvas) {
        return (
            <div className={`alert alert-${props.type}`} role="alert">
                <i className={`bi bi-patch-${props.icon} me-3`}></i>

                { props.message }
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col-md-3 col-1"></div>

            <div className="col-md-6 col-10">
                <div className={`alert alert-${props.type}`} role="alert">
                    <i className={`bi bi-patch-${props.icon} me-3`}></i>

                    { props.message }
                </div>
            </div>

            <div className="col-md-3 col-1"></div>
        </div>
    );
};

export default AlertComponent;