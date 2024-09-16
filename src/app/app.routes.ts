import {
    Routes,
} from '@angular/router';

import {
    DashboardPage,
    NotFoundPage,
    OrderDeletePage,
    OrderFormPage,
    OrderListPage,
    OrderViewPage,
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
        path: 'orders/add',
        component: OrderFormPage,
        title: `Add Order - ${APP_NAME}`,
    },
    {
        path: 'orders/:id',
        component: OrderFormPage,
        title: `Edit Order - ${APP_NAME}`,
    },
    {
        path: 'orders/:id/delete',
        component: OrderDeletePage,
        title: `Edit Order - ${APP_NAME}`,
    },
    {
        path: 'orders/:id/view',
        component: OrderViewPage,
        title: `View Order - ${APP_NAME}`,
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