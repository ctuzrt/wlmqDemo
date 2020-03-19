/*
 * @Author: liwei@esrichina.com.cn 
 * @Date: 2019-06-15 01:30:12 
 * @Last Modified by: liwei@esrichina.com.cn
 * @Last Modified time: 2019-06-22 23:14:53
 */
import Vue from "vue";
import Vuex from "vuex";

import mapStore from "./modules/mapStore"
import sceneStore from "./modules/sceneStore"
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        mapStore,
        sceneStore
    }
});