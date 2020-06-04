import axios from 'axios';
import AuthService from './authservice';
import Vue from 'vue';

let apiUrl = process.env.VUE_APP_API_URL;

/** Default config for axios instance */
let config = {
    baseURL: apiUrl,
};

/** Creating the instance for axios */
const httpClient = axios.create(config);

const authService = new AuthService();

/** Auth token interceptors */
const requestInterceptor = config => {
    Vue.prototype.$keycloak
        .updateToken(30)
        .success(() => {
            Vue.$log.debug('successfully got new token');
            authService.storeTokens(
                Vue.prototype.$keycloak.token,
                Vue.prototype.$keycloak.refreshToken
            );
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

/** response interceptpr */
const responseInterceptor = axios.interceptors.response.use(
    response => response,
    error => {
        Vue.$log.debug('response-status=', error.response.status);

        if (error.response.status !== 401) {
            return Promise.reject(error);
        }
        axios.interceptors.response.eject(responseInterceptor);

        Vue.$log.debug('response-interceptor triggered, continuing ...');
    }
);

/** logger interceptors */
const loggerInterceptor = config => {
    /** TODO */
    return config;
};

/** Adding the request interceptors */
httpClient.interceptors.request.use(requestInterceptor);
httpClient.interceptors.request.use(loggerInterceptor);

export { httpClient };
