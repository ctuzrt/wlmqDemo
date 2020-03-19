/*
 * @Author: liwei@esrichina.com.cn
 * @Date: 2019-06-19 12:02:36
 * @Last Modified by: mikey
 * @Last Modified time: 2019-07-25 13:40:45
 */
import Vue from "vue";

const state = {
    mapView: null, //二维地图视图
    webmap: null, //二维地图webmap
    tilelayerBase: null, //切片底图
    vectortilelayerBase: null, //矢量切片底图
    siteLayer: null, //要素图层
    countyLayer: null, //县界图层
    cityLayer: null, //市界图层
    totalResults: null, //要素查询结果
    highlight: null, //高亮要素
    geoGraphicLayer: null, //绘制添加graphic图层,
    analysiswidget: null, //分析模块
    originRender: null, //初始渲染
    siteLegend: null, //站场图层legend
    selectedFeature: null, //popup选择的要素
    dialogShowFlag: false, //弹出框显示切换标记
    popupTemplate: null, //弹出框模板
    buildTemplate: null //楼栋弹出框模板
};
const getters = {};
const mutations = {

    // 切换底图
    basemapChange(state, paramObj) {
        Vue.prototype.esriLoader
            .loadModules(
                ["esri/layers/VectorTileLayer"]
            )
            .then(([VectorTileLayer]) => {
                let oldmap = paramObj.oldmap;
                let newmap = paramObj.newmap;
                //剔除老底图
                switch (oldmap) {
                    case "tile":
                        state.mapView.map.remove(state.tilelayerBase);
                        break;
                    case "vectortile":
                        state.mapView.map.remove(state.vectortilelayerBase);
                        break;
                }
                //切换新底图
                switch (newmap) {
                    case "tile":
                        state.mapView.map.add(state.tilelayerBase, 0);
                        break;
                    case "vectortile":
                        if (state.vectortilelayerBase) {
                            state.mapView.map.add(state.vectortilelayerBase, 0);
                        } else {
                            state.vectortilelayerBase = new VectorTileLayer({
                                url: window.mapConfig.TileLayer.vectorTileLayer
                            });
                            state.mapView.map.add(state.vectortilelayerBase, 0);
                        }
                        break;
                }
            })
    },

    //属性查询方法
    searchByAttribute(state, paramObj) {
        const query = {
            where: paramObj.pwhere,
            outFields: ["*"],
            returnGeometry: true
        };
        state.mapView.whenLayerView(state.siteLayer).then(function(layerview) {
            state.siteLayer.queryFeatures(query).then(function(results) {
                state.totalResults = results;
                const graphics = results.features;
                //高亮查询结果
                state.highlight = layerview.highlight(graphics);
            }, function(err) {
                alert("查询失败---" + err.message);
            });
        })
    },
    // 初始加载tilemap
    loadTileMap(state) {
        Vue.prototype.esriLoader
            .loadModules(
                ["esri/Map", "esri/views/MapView", "esri/layers/TileLayer",
                    "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer",
                    "esri/widgets/Legend"
                ]
            )
            .then(([Map, MapView, TileLayer, FeatureLayer, GraphicsLayer, Legend]) => {
                let editThisAction = {
                    title: "编辑",
                    id: "edit-this",
                    className: "esri-icon-edit"
                };
                state.tilelayerBase = new TileLayer({
                    url: window.mapConfig.TileLayer.waterBaseLayer
                });
                state.geoGraphicLayer = new GraphicsLayer({ title: "绘制图层" });

                state.buildTemplate = {
                    // 创建属性弹出框内容模板
                    title: "楼栋号：{code}",
                    content: "<p> 地址：{address}</p>" +
                        "<p> 建筑类型：{JG}</p>" +
                        "<p> 层数：{CS}</p>" +
                        "<p> 修建时间：{TIME_1}</p>" +
                        "<p> 房屋编号：{FWBH}</p>"
                };
                state.cityLayer = new FeatureLayer({
                    url: window.mapConfig.waterFeatureLayer.cityLayer,
                    popupTemplate: state.buildTemplate
                });

                state.popupTemplate = {
                    // 创建属性弹出框内容模板
                    title: "人员信息",
                    actions: [editThisAction],
                    content: "<p> 姓名：{Name}</p>" +
                        "<p> 楼栋号：{BH}</p>" +
                        "<p> 门牌号：{MPNo}</p>" +
                        "<p> 类别：{LB}</p>" +
                        "<p> 性别：{Sex}</p>" +
                        "<p> 族别：{Zb}</p>" +
                        "<p> 政治面貌：{ZZMM}</p>" +
                        "<p> 学历：{XueL}</p>" +
                        "<p> 就业情况：{JYQK}</p>" +
                        "<p> 身份证号：{SFZH}</p>" +
                        "<p> 电话：{TelNo}</p>" +
                        "<p> 原籍：{YHJ}</p>"
                };
                state.siteLayer = new FeatureLayer({
                    url: window.mapConfig.waterFeatureLayer.siteLayer,
                    popupTemplate: state.popupTemplate
                });
                state.webmap = new Map({
                    // basemap: "topo"
                });
                state.webmap.addMany([state.tilelayerBase, state.cityLayer, state.siteLayer, state.geoGraphicLayer]);
                state.mapView = new MapView({
                    container: "viewDiv",
                    map: state.webmap,
                    center: [window.mapConfig.center.x, window.mapConfig.center.y],
                    zoom: window.mapConfig.zoom
                });
                state.mapView.ui.remove("zoom");
                state.mapView.whenLayerView(state.siteLayer).then(function(layerview) {
                    state.originRender = state.siteLayer.renderer;
                });

                //监听要素编辑
                state.mapView.popup.on("trigger-action", function(event) {
                    if (event.action.id === "edit-this") {
                        state.dialogShowFlag = true;
                        state.mapView.popup.close();
                        state.selectedFeature = state.mapView.popup.selectedFeature; //编辑时，存储选中要素
                    }
                });

                state.siteLegend = new Legend({
                    view: state.mapView,
                    layerInfos: [{
                        layer: state.siteLayer
                    }]
                });
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