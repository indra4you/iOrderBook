export const LoadingFormComponent = (
): JSX.Element => {
    return (
        <div className="placeholder-glow">
            <div className="row">
                <div className="col-md-8 mb-3">
                    <label className="form-label col-5 placeholder"></label>
    
                    <span className="form-control col-12 placeholder"></span>
                </div>
    
                <div className="col-md-4 mb-3">
                    <label className="form-label col-5 placeholder"></label>
    
                    <span className="form-control col-12 placeholder"></span>
                </div>
            </div>

            <h3 className="mt-3">
                Products
            </h3>

            <table className="table">
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
                        <th scope="col">
                            <span className="form-control col-12 placeholder"></span>
                        </th>
                        <th scope="col">
                            <span className="form-control col-12 placeholder"></span>
                        </th>
                        <th scope="col">
                            <span className="form-control col-12 placeholder"></span>
                        </th>
                        <th scope="col">
                            <span className="form-control col-12 placeholder"></span>
                        </th>
                        <th scope="col">
                            <span className="form-control col-12 placeholder"></span>
                        </th>
                        <th scope="col" colSpan={2}>
                            <span className="form-control col-12 placeholder"></span>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th scope="row" className="text-end">
                            <span className="form-control col-12 placeholder"></span>
                        </th>
                        <td>
                            <span className="form-control col-12 placeholder"></span>
                        </td>
                        <td>
                            <span className="form-control col-12 placeholder"></span>
                        </td>
                        <td>
                            <span className="form-control col-12 placeholder"></span>
                        </td>
                        <td>
                            <span className="form-control col-12 placeholder"></span>
                        </td>
                        <td colSpan={2}>
                            <span className="form-control col-12 placeholder"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <button type="button" disabled className="btn btn-primary col-4 placeholder"></button>
            <button type="button" disabled className="btn btn-secondary col-4 placeholder ms-2"></button>
        </div>
    );
};

export default LoadingFormComponent;