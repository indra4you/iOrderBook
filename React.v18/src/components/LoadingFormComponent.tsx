import {
    PropsWithChildren,
} from 'react';
import {
    Placeholder,
} from 'react-bootstrap';

type LoadingFormProps = {
    noOfFields: number,
};

export const LoadingFormComponent = (
    props: PropsWithChildren<LoadingFormProps>,
): JSX.Element => {
    return (
        <Placeholder animation="glow">
            {
                [...Array(props.noOfFields).keys()]
                    .map(
                        (_, index) => {
                            return (
                                <div key={index} className="mb-3">
                                    <Placeholder xs={5} />
                                    
                                    <Placeholder xs={12} />
                                </div>
                            )
                        }
                    )
            }
            
            <Placeholder.Button variant="dark" xs={4} />
            { ` ` }
            <Placeholder.Button variant="secondary" xs={4} />
        </Placeholder>
    );
};

export default LoadingFormComponent;