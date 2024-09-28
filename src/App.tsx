import {
    Route,
    Routes,
} from 'react-router-dom';

import {
    FooterComponent,
    NavBarComponent,
} from './components';
import {
    DashboardPage,
    NotFoundPage,
    OrderDeletePage,
    OrderFormPage,
    OrderListPage,
    OrderViewPage,
    ProductListPage,
} from './pages';
import {
    ServiceContext,
    ServiceProvider,
} from './services';

// TODO: On "Save File", user gets navigated to dashboard but no content is displayed

export const App = (
): JSX.Element => {
    const serviceProvider: ServiceProvider = new ServiceProvider();
    
    return (
        <ServiceContext.Provider value={serviceProvider}>
            <NavBarComponent />

            <Routes>
                <Route path='/' Component={DashboardPage} />

                <Route path='/products' Component={ProductListPage} />

                <Route path='/orders'>
                    <Route path='/orders' Component={OrderListPage} />

                    <Route path='/orders/add' Component={OrderFormPage} />
                    <Route path='/orders/:id' Component={OrderViewPage} />
                    <Route path='/orders/:id/edit' Component={OrderFormPage} />
                    <Route path='/orders/:id/delete' Component={OrderDeletePage} />
                </Route>

                <Route path='*' Component={NotFoundPage} />
            </Routes>
            
            <FooterComponent />
        </ServiceContext.Provider>
    );
};

export default App;