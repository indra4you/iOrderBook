import {
    Col,
    Placeholder,
    Row,
    Table,
} from 'react-bootstrap';

export const LoadingFormComponent = (
): JSX.Element => {
    return (
        <Placeholder animation="glow">
            <Row>
                <Col xs="12" md="8" className="mb-3">
                    <Placeholder xs="5" />
                    <Placeholder xs="12" />
                </Col>
    
                <Col xs="12" md="4" className="mb-3">
                    <Placeholder xs="5" />
                    <Placeholder xs="12" />
                </Col>
            </Row>

            <h3 className="mt-3">
                Products
            </h3>

            <Table>
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
                            <Placeholder />
                        </th>
                        <th scope="col">
                            <Placeholder />
                        </th>
                        <th scope="col">
                            <Placeholder />
                        </th>
                        <th scope="col">
                            <Placeholder />
                        </th>
                        <th scope="col">
                            <Placeholder />
                        </th>
                        <th scope="col" colSpan={2}>
                            <Placeholder />
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th scope="row" className="text-end">
                            <Placeholder />
                        </th>
                        <td>
                            <Placeholder />
                        </td>
                        <td>
                            <Placeholder />
                        </td>
                        <td>
                            <Placeholder />
                        </td>
                        <td>
                            <Placeholder />
                        </td>
                        <td colSpan={2}>
                            <Placeholder />
                        </td>
                    </tr>
                </tbody>
            </Table>
            
            <Placeholder.Button variant="dark" xs={4} />
            { ` ` }
            <Placeholder.Button variant="secondary" xs={4} />
        </Placeholder>
    );
};

export default LoadingFormComponent;