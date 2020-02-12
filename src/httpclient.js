import axios from 'axios';

/** Default config for axios instance */
let config = {
    baseURL: "http://localhost:8001/"
    //baseURL: "https://api.gendercomics.net/"
};

/** Creating the instance for axios */
const httpClient = axios.create(config);

/** Auth token interceptors */
const authInterceptor = config => {
    const token = localStorage.getItem('access-token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

/** logger interceptors */
const loggerInterceptor = config => {
    /** TODO */
    return config;
};

/** Adding the request interceptors */
httpClient.interceptors.request.use(authInterceptor);
httpClient.interceptors.request.use(loggerInterceptor);

/** Adding the response interceptors */
httpClient.interceptors.response.use(
    response => {
        /** TODO: Add any response interceptors */
        return response;
    },
    error => {
        /** TODO: Do something with response error */
        return Promise.reject(error);
    }
);

export {httpClient};