import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import ComicForm from './views/ComicForm';
import Comics from './views/Comics';
import Roles from './views/Roles';
import RoleForm from './views/RoleForm';
import Publishers from './views/Publishers';
import PublisherForm from './views/PublisherForm';
import Persons from './views/Persons';
import PersonForm from './views/PersonForm';
import Keywords from './views/Keywords';
import KeywordForm from './views/KeywordForm';
import Predicates from './views/Predicates';
import AuthService from './services/authservice';
import keycloak from './services/keycloak';

const authService = new AuthService();

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { title: 'gendercomics.net' },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('./views/About.vue'),
        },
        {
            path: '/comics',
            name: 'comics',
            component: Comics,
            meta: { title: 'gendercomics.net:comics' },
        },
        {
            path: '/comics/:id',
            name: 'ComicForm',
            component: ComicForm,
            meta: { title: 'gendercomics.net:comics' },
        },
        {
            path: '/persons',
            name: 'persons',
            component: Persons,
            meta: { title: 'gendercomics.net:persons' },
        },
        {
            path: '/persons/:id',
            name: 'PersonForm',
            component: PersonForm,
            meta: { title: 'gendercomics.net:persons' },
        },
        {
            path: '/publishers',
            name: 'publishers',
            component: Publishers,
            meta: { title: 'gendercomics.net:publishers' },
        },
        {
            path: '/publishers/:id',
            name: 'PublisherForm',
            component: PublisherForm,
            meta: { title: 'gendercomics.net:publishers' },
        },
        {
            path: '/roles',
            name: 'roles',
            component: Roles,
            meta: { title: 'gendercomics.net:roles' },
        },
        {
            path: '/roles/:id',
            name: 'RoleForm',
            component: RoleForm,
            meta: { title: 'gendercomics.net:roles' },
        },
        {
            path: '/keywords',
            name: 'keywords',
            component: Keywords,
            meta: { title: 'gendercomics.net:keywords' },
        },
        {
            path: '/keywords/:id',
            name: 'KeywordForm',
            component: KeywordForm,
            meta: { title: 'gendercomics.net:keywords' },
        },
        {
            path: '/predicates',
            name: 'predicates',
            component: Predicates,
            meta: { title: 'gendercomics.net:predicates' },
        },
        {
            path: '/logout',
            beforeEnter() {
                authService.clear();
                keycloak.logout({
                    redirectUri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URL,
                });
            },
        },
    ],
});
