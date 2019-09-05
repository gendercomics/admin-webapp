import Vue from "vue";
import App from "./App.vue";
import VueLogger from "vuejs-logger";
import router from "./router";
import * as Keycloak from 'keycloak-js'

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

let initOptions = {
    url: "http://sso.localhost/auth",
    realm: "gendercomics",
    clientId: "gendercomics-admin-app",
    onLoad: "login-required"
};

let keycloak = Keycloak(initOptions);

keycloak
    .init({onLoad: initOptions.onLoad})
    .success(auth => {
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
            keycloak
                .updateToken(70)
                .success(refreshed => {
                    if (refreshed) {
                        Vue.$log.debug("Token refreshed" + refreshed);
                    } else {
                        Vue.$log.warn(
                            "Token not refreshed, valid for " +
                            Math.round(
                                keycloak.tokenParsed.exp +
                                keycloak.timeSkew -
                                new Date().getTime() / 1000
                            ) +
                            " seconds"
                        );
                    }
                })
                .error(() => {
                    Vue.$log.error("Failed to refresh token");
                });
        }, 6000);
    })
    .error(() => {
        Vue.$log.error("Authentication failed");
    });
