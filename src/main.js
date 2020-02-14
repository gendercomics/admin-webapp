import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import * as Keycloak from "keycloak-js";
import VueLogger from "vuejs-logger";
import BootstrapVue from "bootstrap-vue";
import "./styles/styles.scss";
import moment from "moment";

Vue.config.productionTip = false;

const options = {
  isEnabled: true,
  logLevel: Vue.config.productionTip ? "error" : "debug",
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: "|",
  showConsoleColors: true
};

Vue.use(VueLogger, options);

let keycloakUrl = process.env.VUE_APP_KEYCLOAK_AUTH_URL;
let keycloakRealm = process.env.VUE_APP_KEYCLOAK_REALM;
let apiUrl = process.env.VUE_APP_API_URL;

let initOptions = {
  //url: 'https://sso.gendercomics.net/auth/', realm: 'gendercomics-stage', clientId: 'gendercomics-admin', onLoad: 'login-required'
  //url: 'http://localhost:81/auth/', realm: 'gendercomics', clientId: 'gendercomics-admin', onLoad: 'login-required'
  url: keycloakUrl, realm: keycloakRealm, clientId: "gendercomics-admin", onLoad: "login-required"
};

let keycloak = Keycloak(initOptions);

/** Auth token interceptors */
const authInterceptor = config => {
  keycloak.updateToken(30).success(() => {
    Vue.$log.debug("successfully got new token");

    localStorage.setItem("access-token", keycloak.token);
    localStorage.setItem("refresh-token", keycloak.refreshToken);
  }).error(() => {
    Vue.$log.error("updateToken error");
  });

  const token = localStorage.getItem("access-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

Vue.use({
  install(Vue) {
    //Vue.prototype.$api = axios.create({baseURL: 'https://api.gendercomics.net/'});
    //Vue.prototype.$api = axios.create({baseURL: 'http://localhost:8001/'});
    Vue.prototype.$api = axios.create({ baseURL: apiUrl });
  }
});

Vue.prototype.moment = moment;

/** Adding the request interceptors */
Vue.prototype.$api.interceptors.request.use(authInterceptor);

Vue.use(BootstrapVue);

keycloak.init({ onLoad: initOptions.onLoad }).success((auth) => {

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

  setTimeout(() => {
    keycloak.updateToken(70).success((refreshed) => {
      if (refreshed) {
        Vue.$log.debug("Token refreshed" + refreshed);
      } else {
        Vue.$log.warn("Token not refreshed, valid for "
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + " seconds");
      }
    }).error(() => {
      Vue.$log.error("Failed to refresh token");
    });
  }, 60000);

}).error(() => {
  Vue.$log.error("Authentication failed!");
});
