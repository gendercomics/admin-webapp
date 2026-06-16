import axios from 'axios';
import AuthService from './authservice';
import keycloak from './keycloak';
import logger from './logger';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const authService = new AuthService();

const requestInterceptor = (config) => {
    keycloak
        .updateToken(30)
        .then(() => {
            logger.debug('successfully got new token');
            authService.storeTokens(keycloak.token, keycloak.refreshToken);
        })
        .catch(() => {
            logger.error('updateToken error');
        });

    const token = authService.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

const responseInterceptor = httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        logger.debug('response-status=', error.response.status);

        if (error.response.status !== 401) {
            return Promise.reject(error);
        }
        httpClient.interceptors.response.eject(responseInterceptor);

        logger.debug('response-interceptor: trying token refresh');

        return keycloak
            .updateToken(30)
            .then(() => {
                authService.storeTokens(keycloak.token, keycloak.refreshToken);
                logger.debug('response-interceptor: token refreshed');
                error.config.headers['Authorization'] =
                    'Bearer ' + authService.getAccessToken();
                return httpClient(error.response.config);
            })
            .catch(() => {
                logger.error('token refresh failed');
                authService.clear();
                return Promise.reject(error);
            });
    }
);

const loggerInterceptor = (config) => {
    /** TODO */
    return config;
};

httpClient.interceptors.request.use(requestInterceptor);
httpClient.interceptors.request.use(loggerInterceptor);

export { httpClient };
