import {
    Container,
    Nav,
    Navbar,
    NavDropdown,
    NavItem,
} from 'react-bootstrap';
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
            <Navbar expand="lg" className="bg-white border-bottom" sticky="top">
                <Container>
                    <Navbar.Brand as={NavLink} to="/" className="fs-4 h1 mb-0">
                        <i className="bi bi-hdd-rack"></i>
                        <span className="ms-2">iOrder Book</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarContent" />

                    <Navbar.Collapse id="navbarContent" role="navigation">
                        <Nav className="me-auto">
                            <NavLink to="/" className={navLinkActive}>
                                <i className="bi bi-display"></i>
                                <span className="ms-2">Dashboard</span>
                            </NavLink>

                            <NavLink to="/orders" className={navLinkActive}>
                                <i className="bi bi-postcard"></i>
                                <span className="ms-2">Orders</span>
                            </NavLink>

                            <NavLink to="/products" className={navLinkActive}>
                                <i className="bi bi-receipt"></i>
                                <span className="ms-2">Products</span>
                            </NavLink>
                        </Nav>

                        <Nav>
                            {
                                !canPerformFileOperations() &&
                                    <NavItem>
                                        <span className="nav-link fs-5 active" title="iData File">
                                            <span className="ms-2">( In Memory )</span>
                                        </span>
                                    </NavItem>
                            }

                            {
                                canPerformFileOperations() &&
                                    <NavDropdown id="navFileDropdown" title={fileName()} placement="auto-end" className="fs-5">
                                        {
                                            !hasFileHandle() &&
                                                <NavDropdown.Item onClick={saveClicked} className="fs-5" title="Save data to a new file">
                                                    <i className="bi bi-download"></i>
                                                    <span className="ms-2">Save to File</span>
                                                </NavDropdown.Item>
                                        }

                                        <NavDropdown.Item onClick={openClicked} className="fs-5" title="Open existing data file">
                                            <i className="bi bi-upload"></i>
                                            <span className="ms-2">Open File</span>
                                        </NavDropdown.Item>

                                        {
                                            hasFileHandle() &&
                                                <>
                                                    <NavDropdown.Divider />

                                                    <NavDropdown.Item onClick={closeClicked} className="fs-5" title="Close currently open file">
                                                        <i className="bi bi-x-octagon"></i>
                                                        <span className="ms-2">Close File</span>
                                                    </NavDropdown.Item>
                                                </>
                                        }
                                    </NavDropdown>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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