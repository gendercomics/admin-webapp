import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ComicForm from './views/ComicForm';
import Comics from './views/Comics';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: 'about' */ './views/About.vue')
        },
        {
            path: '/comics/:id',
            name: 'comic',
            component: ComicForm
        },
        {
            path: '/comics',
            name: 'comics',
            component: Comics
        },
        {
            path: '/logout',
            beforeEnter() {location.href = 'http://localhost:81/auth/realms/gendercomics/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Flocalhost%3A8080'}
        },
    ]
});
