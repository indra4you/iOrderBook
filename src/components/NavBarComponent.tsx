import {
    NavigateFunction,
    useNavigate,
} from 'react-router';
import {
    NavLink,
    NavLinkRenderProps,
} from 'react-router-dom';

import {
    ServiceProvider,
    useServiceContext,
} from '../services';

export const NavBarComponent = (
): JSX.Element => {
    const serviceProvider: ServiceProvider = useServiceContext()!;
    const navigate: NavigateFunction = useNavigate();
    
    function fileName(
    ): string {
        return serviceProvider.data.name ?? '( In Memory )';
    };

    function canPerformFileOperations(
    ): boolean {
        return serviceProvider.data.canOpenAndSaveFile;
    };

    function hasFileHandle(
    ): boolean {
        return serviceProvider.data.hasHandle;
    };

    function navLinkActive(
        props: NavLinkRenderProps,
    ): string {
        let classNames: string[] = [
            "nav-link",
            "fs-5",
        ];

        if (props.isActive) {
            classNames.push("active");
        }

        return classNames.join(' ');
    }

    async function saveClicked(
    ): Promise<void> {
        const result: boolean = await serviceProvider.data.create();
        if (!result) {
            return;
        }

        await serviceProvider.data.saveAsRoot();

        navigate('/');
    };

    async function openClicked(
    ): Promise<void> {
        if (serviceProvider.data.isDirty) {
            const response: boolean = confirm('Looks like there are Products and/or Orders in the "Memory" which will be gone once if you open an existing file.\n\nAre you sure you still want to open the file?');
            if (!response) {
                return;
            }
        }

        const result: boolean = await serviceProvider.data.open();
        if (result) {
            navigate('/');
        }
    };

    function closeClicked(
    ): void {
        if (!hasFileHandle) {
            return;
        }

        serviceProvider.data.close();

        navigate('/');
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark text-bg-primary">
                <div className="container">
                    <NavLink to="/" className="navbar-brand mb-0 h1 fs-4">
                        <i className="bi bi-hdd-rack"></i>
                        <span className="ms-2">iOrder Book</span>
                    </NavLink>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div id="navbarContent" className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className={navLinkActive}>
                                    <i className="bi bi-display"></i>
                                    <span className="ms-2">Dashboard</span>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/orders" className={navLinkActive}>
                                    <i className="bi bi-postcard"></i>
                                    <span className="ms-2">Orders</span>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/products" className={navLinkActive}>
                                    <i className="bi bi-receipt"></i>
                                    <span className="ms-2">Products</span>
                                </NavLink>
                            </li>
                        </ul>

                        <ul className="navbar-nav d-flex">
                            {
                                !canPerformFileOperations() &&
                                    <li className="nav-item dropdown">
                                        <span className="nav-link fs-5 active" title="iData File">
                                            <span className="ms-2">( In Memory )</span>
                                        </span>
                                    </li>
                            }

                            {
                                canPerformFileOperations() &&
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link fs-5 active dropdown-toggle" role="button" title="iData File" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span className="ms-2">{ fileName() }</span>
                                        </a>

                                        <ul className="dropdown-menu dropdown-menu-end">
                                            {
                                                !hasFileHandle() &&
                                                    <li>
                                                        <button type="button" onClick={saveClicked} className="dropdown-item fs-5" title="Save data to a new file">
                                                            <i className="bi bi-download"></i>
                                                            <span className="ms-2">Save to File</span>
                                                        </button>
                                                    </li>
                                            }

                                            <li>
                                                <button type="button" onClick={openClicked} className="dropdown-item fs-5" title="Open existing data file">
                                                    <i className="bi bi-upload"></i>
                                                    <span className="ms-2">Open File</span>
                                                </button>
                                            </li>

                                            {
                                                hasFileHandle() &&
                                                    <>
                                                        <li>
                                                            <hr className="dropdown-divider" />
                                                        </li>
                                                        
                                                        <li>
                                                            <button type="button" onClick={closeClicked} className="dropdown-item fs-5" title="Close currently open file">
                                                                <i className="bi bi-x-octagon"></i>
                                                                <span className="ms-2">Close File</span>
                                                            </button>
                                                        </li>
                                                    </>
                                            }
                                        </ul>
                                    </li>
                                }
                        </ul>
                    </div>
                </div>
            </nav>

            {
                !canPerformFileOperations() &&
                    <p className="lead bg-danger-subtle text-center py-2">
                        Your browser does <strong>NOT support File</strong> operations!
                    </p>
            }
        </>
    );
};

export default NavBarComponent;