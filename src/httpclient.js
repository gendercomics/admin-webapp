import axios from 'axios';

/** Default config for axios instance */
let config = {
    baseURL: 'http://localhost:8001/',
    //baseURL: "https://api.gendercomics.net/"
};

/** Creating the instance for axios */
const httpClient = axios.create(config);

/** Auth token interceptors */
const authInterceptor = config => {
    const token = localStorage.getItem('access-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

/** response interceptpr */
const responseInterceptor = axios.interceptors.response.use(
  response => response,
  error => {
      this.$log.debug('response-status=', error.response.status);

      if (error.response.status !== 401) {
          return Promise.reject(error);
      }
      axios.interceptors.response.eject(responseInterceptor);

      this.$log.debug("response-interceptor triggered, continuing ...")
  }
);

/** logger interceptors */
const loggerInterceptor = config => {
    /** TODO */
    return config;
};

/** Adding the request interceptors */
httpClient.interceptors.request.use(authInterceptor);
httpClient.interceptors.request.use(loggerInterceptor);

export { httpClient };
