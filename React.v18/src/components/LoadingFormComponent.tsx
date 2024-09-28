import {
    PropsWithChildren,
} from 'react';

type LoadingFormProps = {
    noOfFields: number,
};

export const LoadingFormComponent = (
    props: PropsWithChildren<LoadingFormProps>,
): JSX.Element => {
    return (
        <div className="placeholder-glow">
            {
                [...Array(props.noOfFields).keys()]
                    .map(
                        (_, index) => {
                            return (
                                <div key={index} className="mb-3">
                                    <label className="form-label col-5 placeholder"></label>
            
                                    <span className="form-control col-12 placeholder"></span>
                                </div>
                            )
                        }
                    )
            }
            
            <button type="button" disabled className="btn btn-primary col-4 placeholder"></button>
            <button type="button" disabled className="btn btn-secondary col-4 placeholder ms-2"></button>
        </div>
    );
};

export default LoadingFormComponent;