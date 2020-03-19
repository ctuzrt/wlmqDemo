/*
 * @Author: liwei@esrichina.com.cn
 * @Date: 2019-06-21 14:45:11
 * @Last Modified by: mikey
 * @Last Modified time: 2019-07-25 14:45:13
 */
import Vue from "vue";

const state = {
    sceneView: null
};
const getters = {

};
const mutations = {
    setSceneView(state, sceneView) {
        state.sceneView = sceneView;
    },
    loadScene(state) {
        Vue.prototype.esriLoader
            .loadModules(
                [
                    "esri/Map",
                    "esri/views/SceneView",
                    "esri/layers/ElevationLayer",
                    "esri/layers/TileLayer",
                    "esri/layers/SceneLayer",
                    "esri/Ground"
                ]
            )
            .then(
                ([Map, SceneView, ElevationLayer, TileLayer, SceneLayer, Ground]) => {
                    const worldElevation = new ElevationLayer({
                        url: window.mapConfig.TileLayer.baseEelevation
                    });
                    const imageryLayer = new TileLayer({
                        url: window.mapConfig.TileLayer.baseImagery
                    });
                    const imageryAnnoLayer = new TileLayer({
                        url: window.mapConfig.TileLayer.baseImageryAnno
                    });

                    const sceneLayer = new SceneLayer({
                        portalItem: window.mapConfig.SceneLayer.portalItem,
                        popupEnabled: true
                    });
                    const symbol = {
                        type: "mesh-3d",
                        symbolLayers: [{
                            type: "fill",
                            material: {
                                color: [244, 247, 134]
                            }
                        }]
                    };
                    sceneLayer.renderer = {
                        type: "simple",
                        symbol: symbol
                    };

                    const map = new Map({
                        // basemap: "hybrid",
                        // ground: "world-elevation"
                    });
                    map.ground.layers.add(worldElevation);
                    map.addMany([imageryLayer, imageryAnnoLayer, sceneLayer]);

                    const view = new SceneView({
                        container: "view3Div",
                        map: map,
                        camera: window.mapConfig.camera
                    });

                    state.sceneView = view;
                }
            );
    },
    loadWebScene(state) {
        Vue.prototype.esriLoader
            .loadModules(["esri/views/SceneView", "esri/WebScene"])
            .then(([SceneView, WebScene]) => {
                const webScene = new WebScene({
                    portalItem: window.mapConfig.WebScene.portalItem
                });

                const view = new SceneView({
                    container: "view3Div",
                    map: webScene
                });
                state.sceneView = view;
            });
    }
};
const actions = {};
export default {
    state,
    getters,
    mutations,
    actions
};