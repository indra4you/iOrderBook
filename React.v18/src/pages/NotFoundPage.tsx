import {
    Link,
} from 'react-router-dom';

export const NotFoundPage = (
): JSX.Element => {
    return (
        <section className="container font-monospace w-100 text-center">
            <div className="display-1 mt-5">404</div>
            
            <div className="display-4">Page Not Found</div>

            <div className="display-6 my-5">
                <Link to="/" className="btn btn-primary text-decoration-none">
                    lets got back to
                    <i className="bi bi-house ps-2"></i>
                </Link>
            </div>
        </section>
    );
};