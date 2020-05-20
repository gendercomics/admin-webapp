import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ComicForm from './views/ComicForm';
import Comics from './views/Comics';
import Roles from './views/Roles';
import RoleForm from './views/RoleForm';
import Publishers from './views/Publishers';
import PublisherForm from './views/PublisherForm';
import Persons from './views/Persons';
import PersonForm from './views/PersonForm';
import AuthService from './services/authservice';

Vue.use(Router);

let authServerUrl = process.env.VUE_APP_KEYCLOAK_BASE_URL;
let redirectURI = process.env.VUE_APP_KEYCLOAK_REDIRECT_URL;

const authService = new AuthService();

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: 'gendercomics.net - admin',
            },
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: 'about' */ './views/About.vue'),
        },
        {
            path: '/comics',
            name: 'comics',
            component: Comics,
            meta: {
                title: 'gendercomics.net - admin: comics',
            },
        },
        {
            path: '/comics/:id',
            name: 'ComicForm',
            component: ComicForm,
        },
        {
            path: '/persons',
            name: 'persons',
            component: Persons,
        },
        {
            path: '/persons/:id',
            name: 'PersonForm',
            component: PersonForm,
        },
        {
            path: '/publishers',
            name: 'publishers',
            component: Publishers,
        },
        {
            path: '/publishers/:id',
            name: 'PublisherForm',
            component: PublisherForm,
        },
        {
            path: '/roles',
            name: 'roles',
            component: Roles,
        },
        {
            path: '/roles/:id',
            name: 'RoleForm',
            component: RoleForm,
        },
        {
            path: '/logout',
            beforeEnter() {
                location.href =
                    authServerUrl +
                    'auth/realms/gendercomics/protocol/openid-connect/logout?redirect_uri=' +
                    redirectURI;
                authService.clear();
            },
        },
    ],
});
