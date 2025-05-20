import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import 'font-awesome/css/font-awesome.css';

import * as esriLoader from "esri-loader";

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.esriLoader = esriLoader;
Vue.prototype.esriLoader.setDefaultOptions({
    url: window.mapConfig.jsapiUrl,
    css: window.mapConfig.cssUrl
})
//test
router.beforeEach((to, from, next) => {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.name !== "login") {
        next({
            path: "/login"
        });
    }
    next();
})

new Vue({
    router,
    store,
    render: h => h(App),
    data: {
        eventBus: new Vue()
    }
}).$mount("#app");