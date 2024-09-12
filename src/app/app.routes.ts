import {
    Routes,
} from '@angular/router';

import {
    DashboardPage,
    NotFoundPage,
    OrderListPage,
    ProductListPage,
} from './pages';

const APP_NAME: string = 'iOrder Book';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardPage,
        title: `Dashboard - ${APP_NAME}`,
    },

    {
        path: 'orders',
        component: OrderListPage,
        title: `Orders - ${APP_NAME}`,
    },

    {
        path: 'products',
        component: ProductListPage,
        title: `Products - ${APP_NAME}`,
    },

    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '**',
        component: NotFoundPage,
    },
];