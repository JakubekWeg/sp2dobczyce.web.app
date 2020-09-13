import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from '../views/MainPage.vue';
import TimetableView from '../views/TimetableView';
import SettingsView from '../views/SettingsView';
import TimetablesListView from '../views/TimetablesListView';
import NotFoundLayout from '../views/NotFoundLayout';
import NotificationsView from '../views/NotificationsView';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: MainPage,
        meta: {navTab: 'home'},
    },
    {
        path: '/plan-lekcji',
        component: TimetableView,
        meta: {navTab: 'plan', title: 'Plan lekcji'},
    },
    {
        path: '/plan-lekcji/lista',
        component: TimetablesListView,
        meta: {navTab: 'plan', title: 'Plany lekcji'},
    },
    {
        path: '/plan-lekcji/:id',
        component: TimetableView,
        meta: {navTab: 'plan', title: 'Plan lekcji'},
    },
    {
        path: '/ustawienia',
        component: SettingsView,
        meta: {navTab: 'settings', title: 'Ustawienia'},
    },
    {
        path: '/ustawienia/powiadomienia',
        component: NotificationsView,
        meta: {navTab: 'settings', title: 'Powiadomienia'},
    },
    {
        path: '*',
        component: NotFoundLayout,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
