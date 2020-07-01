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
    Vue.prototype.keycloak
        .updateToken(30)
        .success(() => {
            Vue.$log.debug('successfully got new token');
            authService.storeTokens(
                Vue.prototype.keycloak.token,
                Vue.prototype.keycloak.refreshToken
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
const responseInterceptor = httpClient.interceptors.response.use(
    response => response,
    error => {
        Vue.$log.debug('response-status=', error.response.status);

        if (error.response.status !== 401) {
            return Promise.reject(error);
        }
        httpClient.interceptors.response.eject(responseInterceptor);

        Vue.$log.debug('response-interceptor: trying token refresh');

        Vue.prototype.keycloak
            .updateToken(30)
            .success(() => {
                authService.storeTokens(
                    Vue.prototype.keycloak.token,
                    Vue.prototype.keycloak.refreshToken
                );
                Vue.$log.debug('response-interceptor: token refreshed');
                error.config.headers['Authorization'] =
                    'Bearer ' + authService.getAccessToken();
                return httpClient(error.response.config);
            })
            .error(() => {
                Vue.$log.error('token refresh failed');
                authService.clear();
                return Promise.reject(error);
            });
    }
);

/** logger interceptors */
const loggerInterceptor = config => {
    Vue.$log.debug('apiUrl=' + apiUrl);
    return config;
};

/** Adding the request interceptors */
httpClient.interceptors.request.use(requestInterceptor);
httpClient.interceptors.request.use(loggerInterceptor);

export { httpClient };
