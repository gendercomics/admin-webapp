import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

Vue.config.productionTip = false;

Vue.use({
  install(Vue) {
    Vue.prototype.$api = axios.create({
      baseURL: "http://localhost:8001/"
    });
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
