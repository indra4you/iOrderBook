import {
    Routes,
} from '@angular/router';

import {
    DashboardPage,
    NotFoundPage,
    OrderFormPage,
    OrderListPage,
} from './pages';

const APP_NAME: string = 'Mithay Samiti';

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
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '**',
        component: NotFoundPage,
    },
];