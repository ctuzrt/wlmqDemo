/*
 * @Author: liwei@esrichina.com.cn
 * @Date: 2019-06-15 01:30:07
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-07-15 09:59:09
 */
import Vue from "vue";
import Router from "vue-router";
import index from "../views/main/index.vue";
import login from "../views/login/login.vue";
import vueAJSComponent from "../components/base/vueAJS.vue";

Vue.use(Router);

export default new Router({
    mode: "history", //默认hash模式
    routes: [{
            path: "/login",
            name: "login",
            component: login
        },
        {
            path: "/",
            name: "index",
            component: index,
            children: [{
                path: "/vueAJS",
                name: "vueAJS",
                component: vueAJSComponent
            }]
        }
    ]
});