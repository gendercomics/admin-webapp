import Vue from 'vue';
import App from './App.vue';
import router from './router';
import * as Keycloak from 'keycloak-js';
import VueLogger from 'vuejs-logger';
import BootstrapVue from 'bootstrap-vue';
import './styles/styles.scss';
import moment from 'moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faEdit,
    faExternalLinkAlt,
    faSearch,
    faTags,
    faTimesCircle,
    faTrashAlt,
    faUserSecret,
} from '@fortawesome/free-solid-svg-icons';
import AuthService from './services/authservice';

library.add(
    faEdit,
    faExternalLinkAlt,
    faSearch,
    faTags,
    faTimesCircle,
    faTrashAlt,
    faUserSecret
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

const options = {
    isEnabled: true,
    logLevel: Vue.config.productionTip ? 'error' : 'debug',
    stringifyArguments: false,
    showLogLevel: true,
    showMethodName: true,
    separator: '|',
    showConsoleColors: true,
};

const authService = new AuthService();

Vue.use(VueLogger, options);

let keycloakUrl = process.env.VUE_APP_KEYCLOAK_AUTH_URL;
let keycloakRealm = process.env.VUE_APP_KEYCLOAK_REALM;

let initOptions = {
    url: keycloakUrl,
    realm: keycloakRealm,
    clientId: 'gendercomics-admin',
    onLoad: 'login-required',
};

Vue.prototype.keycloak = Keycloak(initOptions);
Vue.prototype.moment = moment;

Vue.use(BootstrapVue);

Vue.prototype.keycloak
    .init({ onLoad: initOptions.onLoad })
    .success(auth => {
        if (!auth) {
            window.location.reload();
        } else {
            Vue.$log.info('Authenticated');
        }

        new Vue({
            router,
            render: h => h(App),
        }).$mount('#app');

        authService.storeTokens(
            Vue.prototype.keycloak.token,
            Vue.prototype.keycloak.refreshToken
        );
    })
    .error(() => {
        Vue.$log.error('Authentication failed!');
    });
