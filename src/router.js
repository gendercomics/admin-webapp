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

Vue.use(Router);

let authServerUrl = 'https://sso.gendercomics.net/';
let redirectURI = 'https://stage.gendercomics.net/';

//let authServerUrl = 'http://localhost:81/';
//let redirectURI = 'https://localhost:8080/';

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
                //location.href = "http://localhost:81/auth/realms/gendercomics/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Flocalhost%3A8080";
                location.href =
                    authServerUrl +
                    'auth/realms/gendercomics/protocol/openid-connect/logout?redirect_uri=' +
                    redirectURI;
                localStorage.removeItem('access-token');
                localStorage.removeItem('refresh-token');
            },
        },
    ],
});
