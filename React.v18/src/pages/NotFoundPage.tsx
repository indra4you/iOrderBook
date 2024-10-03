import {
    Container,
} from 'react-bootstrap';
import {
    Link,
} from 'react-router-dom';

export const NotFoundPage = (
): JSX.Element => {
    return (
        <Container className="font-monospace w-100 text-center">
            <div className="display-1 mt-5">404</div>
            
            <div className="display-4">Page Not Found</div>

            <div className="display-6 my-5">
                <Link to="/" className="btn btn-dark btn-lg text-decoration-none">
                    lets got back to
                    <i className="bi bi-house ps-3"></i>
                </Link>
            </div>
        </Container>
    );
};

export default NotFoundPage;