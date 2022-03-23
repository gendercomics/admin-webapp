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
import Keywords from './views/Keywords';
import KeywordForm from './views/KeywordForm';
import Predicates from './views/Predicates';

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
                title: 'gendercomics.net',
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
                title: 'gendercomics.net:comics',
            },
        },
        {
            path: '/comics/:id',
            name: 'ComicForm',
            component: ComicForm,
            meta: {
                title: 'gendercomics.net:comics',
            },
        },
        {
            path: '/persons',
            name: 'persons',
            component: Persons,
            meta: {
                title: 'gendercomics.net:persons',
            },
        },
        {
            path: '/persons/:id',
            name: 'PersonForm',
            component: PersonForm,
            meta: {
                title: 'gendercomics.net:persons',
            },
        },
        {
            path: '/publishers',
            name: 'publishers',
            component: Publishers,
            meta: {
                title: 'gendercomics.net:publishers',
            },
        },
        {
            path: '/publishers/:id',
            name: 'PublisherForm',
            component: PublisherForm,
            meta: {
                title: 'gendercomics.net:publishers',
            },
        },
        {
            path: '/roles',
            name: 'roles',
            component: Roles,
            meta: {
                title: 'gendercomics.net:roles',
            },
        },
        {
            path: '/roles/:id',
            name: 'RoleForm',
            component: RoleForm,
            meta: {
                title: 'gendercomics.net:roles',
            },
        },
        {
            path: '/keywords',
            name: 'keywords',
            component: Keywords,
            meta: {
                title: 'gendercomics.net:keywords',
            },
        },
        {
            path: '/keywords/:id',
            name: 'KeywordForm',
            component: KeywordForm,
            meta: {
                title: 'gendercomics.net:keywords',
            },
        },
        {
            path: '/predicates',
            name: 'predicates',
            component: Predicates,
            meta: {
                title: 'gendercomics.net:predicates',
            },
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
