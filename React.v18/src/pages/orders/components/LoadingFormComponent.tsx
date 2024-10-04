import {
    Col,
    Placeholder,
    Row,
    Table,
} from 'react-bootstrap';
import { LoadingTableBodyComponent } from '../../../components';

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
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Product</th>
                        <th scope="col" className="text-end">Quantity</th>
                        <th scope="col" className="text-end">Price</th>
                        <th scope="col" className="text-end">No of Packets</th>
                        <th scope="col" className="text-end">Amount</th>
                    </tr>
                </thead>

                <tbody>
                    <LoadingTableBodyComponent noOfRows={3} noOfColumns={7} />
                </tbody>
            </Table>
            
            <Placeholder.Button variant="dark">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Placeholder.Button>
            &nbsp;&nbsp;
            <Placeholder.Button variant="secondary">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Placeholder.Button>
        </Placeholder>
    );
};

export default LoadingFormComponent;