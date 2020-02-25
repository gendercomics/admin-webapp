import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import * as Keycloak from 'keycloak-js';
import VueLogger from 'vuejs-logger';
import BootstrapVue from 'bootstrap-vue';
import './styles/styles.scss';
import moment from 'moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEdit, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import AuthService from './services/authservice';

library.add(faEdit, faTimesCircle);

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

Vue.use(VueLogger, options);

let keycloakUrl = process.env.VUE_APP_KEYCLOAK_AUTH_URL;
let keycloakRealm = process.env.VUE_APP_KEYCLOAK_REALM;
let apiUrl = process.env.VUE_APP_API_URL;

let initOptions = {
    url: keycloakUrl,
    realm: keycloakRealm,
    clientId: 'gendercomics-admin',
    onLoad: 'login-required',
};

let keycloak = Keycloak(initOptions);

const authService = new AuthService();

/** Auth token interceptors */
const authRequestInterceptor = config => {
    keycloak
        .updateToken(30)
        .success(() => {
            Vue.$log.debug('successfully got new token');
            authService.storeTokens(keycloak.token, keycloak.refreshToken);
        })
        .error(() => {
            Vue.$log.error('updateToken error');
        });

    const token = authService.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

Vue.use({
    install(Vue) {
        Vue.prototype.$api = axios.create({ baseURL: apiUrl });
    },
});

Vue.prototype.moment = moment;

/** Adding the request and response interceptors */
Vue.prototype.$api.interceptors.request.use(authRequestInterceptor);
Vue.prototype.$api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        Vue.$log.debug('response-status=', error.response.status);

        if (error.response.status !== 401) {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }

        if (keycloak.isTokenExpired()) {
            Vue.$log.debug('Token expired');
        }
        
        keycloak
            .updateToken(0)
            .success(refreshed => {
                Vue.$log.debug('Token refreshed=' + refreshed);
                authService.storeTokens(keycloak.token, keycloak.refreshToken);
                const config = error.config;
                const token = authService.getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return new Promise((resolve, reject) => {
                    axios
                        .request(config)
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            })
            .error(() => {
                Vue.$log.error('Failed to refresh token');
                keycloak.clearToken();
            });
    }
);

Vue.use(BootstrapVue);

keycloak
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

        authService.storeTokens(keycloak.token, keycloak.refreshToken);

        setTimeout(() => {
            keycloak
                .updateToken(70)
                .success(refreshed => {
                    if (refreshed) {
                        Vue.$log.debug('Token refreshed' + refreshed);
                    } else {
                        Vue.$log.warn(
                            'Token not refreshed, valid for ' +
                                Math.round(
                                    keycloak.tokenParsed.exp +
                                        keycloak.timeSkew -
                                        new Date().getTime() / 1000
                                ) +
                                ' seconds'
                        );
                    }
                })
                .error(() => {
                    Vue.$log.error('Failed to refresh token');
                });
        }, 60000);
    })
    .error(() => {
        Vue.$log.error('Authentication failed!');
    });
