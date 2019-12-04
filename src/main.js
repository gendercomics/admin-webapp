import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import * as Keycloak from "keycloak-js";
import VueLogger from 'vuejs-logger';
import BootstrapVue from 'bootstrap-vue'
import './styles/styles.scss'

Vue.config.productionTip = false;

let initOptions = {
    url: 'http://0.0.0.0:81/auth', realm: 'gendercomics', clientId: 'gendercomics-admin', onLoad: 'login-required'
};

let keycloak = Keycloak(initOptions);


Vue.use({
    install(Vue) {
        Vue.prototype.$api = axios.create({
            baseURL: "http://localhost:8001/"
        });
    }
});

const options = {
    isEnabled: true,
    logLevel: Vue.config.productionTip ? 'error' : 'debug',
    stringifyArguments: false,
    showLogLevel: true,
    showMethodName: true,
    separator: '|',
    showConsoleColors: true
};

Vue.use(VueLogger, options);
Vue.use(BootstrapVue);

keycloak.init({onLoad: initOptions.onLoad}).success((auth) => {

    if (!auth) {
        window.location.reload();
    } else {
        Vue.$log.info("Authenticated");
    }

    new Vue({
        router,
        render: h => h(App)
    }).$mount("#app");

    localStorage.setItem("access-token", keycloak.token);
    localStorage.setItem("refresh-token", keycloak.refreshToken);
    localStorage.setItem("id-token", keycloak.idToken);

    setTimeout(() => {
        keycloak.updateToken(70).success((refreshed) => {
            if (refreshed) {
                Vue.$log.debug('Token refreshed' + refreshed);
            } else {
                Vue.$log.warn('Token not refreshed, valid for '
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).error(() => {
            Vue.$log.error('Failed to refresh token');
        });
    }, 60000)

}).error(() => {
    Vue.$log.error("Authentication failed!");
});
