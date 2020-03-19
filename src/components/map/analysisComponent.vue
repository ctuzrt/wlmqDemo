<template>
  <!-- 分析模块 -->
  <div class="analysisCollapse">
    <el-collapse accordion
                 @change="anaCollapseChange">
      <p class="titletxt">
        <i class="el-icon-s-grid" />
        分析功能列表
        <i class="el-icon-circle-close"
           style="position:absolute;right:35px;cursor:pointer"
           @click="hideanalysisComp" />
      </p>

      <!-- <el-collapse-item name="visual"
                        class="collapaseitem">
        <template slot="title">
          <i class="header-icon el-icon-picture-outline-round"
             style="padding-right:6px"></i>可视化渲染
        </template>
        <el-radio-group v-model="visualradio"
                        @change="visualChange">
          <div style="padding-top:15px;padding-left:20px">
            <el-radio :label="0">默认值</el-radio>
            <el-radio :label="1">分类(颜色)</el-radio>
          </div>
          <div style="padding-top:15px;padding-left:20px">
            <el-radio :label="2">唯一值</el-radio>
            <el-radio :label="3">热力图</el-radio>
          </div>
        </el-radio-group>
      </el-collapse-item> -->
      <el-collapse-item name="buffer">
        <template slot="title">
          <i class="header-icon el-icon-s-fold"
             style="padding-right:6px"></i>缓冲区查询
        </template>
        <div>
          <span style="font-size:12px;padding-right:10px;padding-left:20px;">缓冲距离：{{distanceValue}} m</span>
          <div style="padding-left:20px;padding-right:20px">
            <el-slider v-model="distanceValue"
                       :min="0"
                       :max="1000"></el-slider>
          </div>
        </div>
        <div>
          <span style="font-size:12px;padding-right:10px;padding-left:20px;">缓冲图形：</span>
          <i class="el-icon-more"
             style="padding-right:5px;cursor:pointer"
             @click="drawBufferPoint" />
          <i class="el-icon-minus"
             style="padding-left:20px;cursor:pointer"
             @click="drawBufferPline" />
          <i class="el-icon-house"
             style="padding-left:20px;cursor:pointer"
             @click="drawBufferPolygon" />
        </div>
      </el-collapse-item>
      <el-collapse-item name="eCharts">
        <template slot="title">
          <i class="header-icon el-icon-s-opportunity"
             style="padding-right:6px"></i>图表统计
        </template>
        <!-- <div id="pieChart"></div> -->
        <el-carousel indicator-position="outside"
                     :autoplay="false"
                     @change="carouselChange">
          <el-carousel-item v-for="(val,index) in statisticsType"
                            :key="index">
            <div :id="val.divID"></div>
          </el-carousel-item>
        </el-carousel>
      </el-collapse-item>
      <!-- <el-collapse-item name="routte">
        <template slot="title">
          <i class="header-icon el-icon-s-marketing"
             style="padding-right:6px"></i>路径分析
        </template>
        <div>路径分析：</div>
      </el-collapse-item> -->
    </el-collapse>
  </div>
</template>

<script>
import { mapStore, mapMutations } from "vuex";
import echarts from "echarts";

export default {
  data () {
    return {
      statisticsType: [{
        divID: "div_mingzu"
      }, {
        divID: "div_xueli"
      }],
      pieChartData: [],
      chartPie: null,
      activeName: "1",
      visualradio: 0,
      distanceValue: 50,
      bufferGeometry: null,
      lastAnaVal: null //标记分析模块关闭时，选中的项
    };
  },
  methods: {
    // 统计切换
    carouselChange (val) {
      let divId = this.statisticsType[val].divID;

    },
    //手风琴选择项改变监听
    anaCollapseChange (val) {
      this.lastAnaVal = val;
      let _self = this;
      let _store = this.$store.state.mapStore;
      if (val == "visual") {
        _store.mapView.ui.add(_store.siteLegend, "bottom-left");
      } else if (val == "eCharts") {
        // 默认加载第一个统计图。民族
        _store.mapView.ui.remove(_store.siteLegend);
        const query = {
          where: "1=1",
          outFields: ["*"],
          returnGeometry: false
        };
        _store.mapView
          .whenLayerView(_store.siteLayer)
          .then(function (layerview) {
            _store.siteLayer.queryFeatures(query).then(
              function (results) {
                let resultArr = [];
                _self.pieChartData = [];
                results.features.forEach((val, index) => {
                  if (resultArr.length == 0) {
                    var obj = {
                      num: 1,
                      type: val.attributes.Zb
                    }
                    resultArr.push(obj);
                  } else {
                    for (let i = 0; i < resultArr.length; i++) {
                      if (resultArr[i].type != val.attributes.Zb) {
                        var obj = {
                          num: 1,
                          type: val.attributes.Zb
                        }
                        resultArr.push(obj);
                      } else {
                        resultArr[i].num++;
                      }
                    }
                  }
                });
                resultArr.forEach((val, index) => {
                  _self.pieChartData.push({ value: val.num, name: val.type });
                })


                // _self.pieChartData.push({ value: num1, name: "等级1" });
                // _self.pieChartData.push({ value: num2, name: "等级2" });
                // _self.pieChartData.push({ value: num3, name: "等级3" });
                // _self.pieChartData.push({ value: num4, name: "等级4" });
                // _self.pieChartData.push({ value: num5, name: "等级5" });
                // _self.pieChartData.push({ value: num6, name: "等级6" });
                // _self.pieChartData.push({ value: num7, name: "等级7" });
                // _self.pieChartData.push({ value: num0, name: "其他" });
                let defaultID = _self.statisticsType[0].divID;
                let chartPie = echarts.init(
                  document.getElementById(defaultID)
                );
                chartPie.setOption({
                  tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                  },
                  legend: {
                    orient: "horizontal",
                    left: "left",
                    data: [
                      "等级1",
                      "等级2",
                      "等级3",
                      "等级4",
                      "等级5",
                      "等级6",
                      "等级7",
                      "其他"
                    ]
                  },
                  series: [
                    {
                      name: "报讯等级",
                      type: "pie",
                      radius: "55%",
                      center: ["50%", "60%"],
                      data: _self.pieChartData,
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                      }
                    }
                  ]
                });
              },
              function (err) {
                console.log("查询失败001---" + err.message);
              }
            );
          });
      } else {
        _store.mapView.ui.remove(_store.siteLegend);
      }
    },

    //关闭分析功能模块界面
    hideanalysisComp () {
      let _store = this.$store.state.mapStore;
      this.$emit("hideComp", { flag: false, val: this.lastAnaVal });
      _store.mapView.ui.remove(_store.siteLegend);
    },

    //缓冲分析--绘制线
    drawBufferPline () {
      let _self = this;
      let _store = this.$store.state.mapStore;
      this.esriLoader
        .loadModules(
          [
            "esri/views/draw/Draw",
            "esri/Graphic",
            "esri/geometry/geometryEngine",
            "esri/geometry/Polyline"
          ]
        )
        .then(([Draw, Graphic, geometryEngine, Polyline]) => {
          let draw = new Draw({
            view: _store.mapView
          });
          clearGraphics(); //清除
          const action = draw.create("polyline");
          _store.mapView.focus();
          action.on(
            ["vertex-add", "vertex-remove", "cursor-update", "redo", "undo"],
            updateVertices
          );
          action.on(["draw-complete"], updateVerticesComp); //单独监听draw-complete
          function updateVerticesComp (event) {
            if (event.vertices.length > 1) {
              const result = createGraphic(event);
              if (result.selfIntersects) {
                event.preventDefault();
              } else {
                getBuffer(); //绘画完成，即生成缓冲区
              }
            }
          }

          function getBuffer () {
            var polySym = {
              type: "simple-fill",
              color: [128, 128, 128, 0.6],
              outline: {
                color: "#DB7093",
                width: 1
              }
            };
            //geodesicBuffer--4326或102100；buffer--非102100的PCS；GeometryService.buffer--非4326的GCS
            var buffer = geometryEngine.geodesicBuffer(
              _self.bufferGeometry,
              _self.distanceValue / 1000,
              "kilometers"
            );
            _store.geoGraphicLayer.add(
              new Graphic({
                geometry: buffer,
                symbol: polySym
              })
            );
            _self.$root.eventBus.$emit("bufferComplete", buffer);
          }

          // 每画一笔，检查下最新画的线段，是否和之前已有的自相交
          function updateVertices (event) {
            if (event.vertices.length > 1) {
              const result = createGraphic(event);
              //如果自相交，双击暂不结束绘制
              if (result.selfIntersects) {
                event.preventDefault();
              }
            }
          }

          // 创建绘制的图形
          function createGraphic (event) {
            const vertices = event.vertices;
            clearGraphics(); //清除

            const graphic = new Graphic({
              geometry: {
                type: "polyline",
                paths: vertices,
                spatialReference: _store.mapView.spatialReference
              },
              symbol: {
                type: "simple-line",
                color: "#FF8C00",
                width: 3,
                cap: "round",
                join: "round"
              }
            });
            _self.bufferGeometry = new Polyline({
              paths: vertices,
              spatialReference: _store.mapView.spatialReference
            });
            const intersectingSegment = getIntersectingSegment(
              graphic.geometry
            );

            if (intersectingSegment) {
              _store.geoGraphicLayer.addMany([graphic, intersectingSegment]);
            } else {
              _store.geoGraphicLayer.add(graphic);
            }

            return {
              selfIntersects: intersectingSegment
            };
          }

          function isSelfIntersecting (polyline) {
            if (polyline.paths[0].length < 3) {
              return false;
            }
            const line = polyline.clone();

            const lastSegment = getLastSegment(polyline);
            line.removePoint(0, line.paths[0].length - 1);
            return geometryEngine.crosses(lastSegment, line);
          }

          function getIntersectingSegment (polyline) {
            if (isSelfIntersecting(polyline)) {
              return new Graphic({
                geometry: getLastSegment(polyline),
                symbol: {
                  type: "simple-line", // autocasts as new SimpleLineSymbol
                  style: "short-dot",
                  width: 3.5,
                  color: "yellow"
                }
              });
            }
            return null;
          }

          function getLastSegment (polyline) {
            const line = polyline.clone();
            const lastXYPoint = line.removePoint(0, line.paths[0].length - 1);
            const existingLineFinalPoint = line.getPoint(
              0,
              line.paths[0].length - 1
            );

            return {
              type: "polyline",
              spatialReference: _store.mapView.spatialReference,
              hasZ: false,
              paths: [
                [
                  [existingLineFinalPoint.x, existingLineFinalPoint.y],
                  [lastXYPoint.x, lastXYPoint.y]
                ]
              ]
            };
          }
          //清除绘制
          function clearGraphics () {
            if (_store.highlight) {
              _store.highlight.remove();
            }
            _store.geoGraphicLayer.removeAll();
          }
        });
    },

    //缓冲分析--绘制面
    drawBufferPolygon () {
      let _self = this;
      let _store = this.$store.state.mapStore;
      this.esriLoader
        .loadModules(
          [
            "esri/views/draw/Draw",
            "esri/Graphic",
            "esri/geometry/geometryEngine",
            "esri/geometry/Polyline",
            "esri/geometry/Polygon"
          ]
        )
        .then(([Draw, Graphic, geometryEngine, Polyline, Polygon]) => {
          let draw = new Draw({
            view: _store.mapView
          });
          clearGraphics(); //清除
          const action = draw.create("polygon");
          _store.mapView.focus();
          action.on(["cursor-update"], updateVertices);
          action.on(["draw-complete"], drawComp);
          function drawComp (event) {
            if (event.vertices.length > 1) {
              createGraphicPolygon(event);
              getBuffer(); //绘画完成，即生成缓冲区
            }
          }

          function getBuffer () {
            var polySym = {
              type: "simple-fill",
              color: [128, 128, 128, 0.6],
              outline: {
                color: "#DB7093",
                width: 1
              }
            };
            //geodesicBuffer--4326或102100；buffer--非102100的PCS；GeometryService.buffer--非4326的GCS
            var buffer = geometryEngine.geodesicBuffer(
              _self.bufferGeometry,
              _self.distanceValue / 1000,
              "kilometers",
              true
            );

            var differenceGeo = geometryEngine.difference(
              buffer,
              _self.bufferGeometry
            );
            _store.geoGraphicLayer.add(
              new Graphic({
                geometry: differenceGeo,
                symbol: polySym
              })
            );
            _self.$root.eventBus.$emit("bufferComplete", differenceGeo);
          }

          // 每画一笔，检查下最新画的线段，是否和之前已有的自相交
          function updateVertices (event) {
            if (event.vertices.length > 1) {
              const result = createGraphic(event);
              //如果自相交，双击暂不结束绘制
              if (result.selfIntersects) {
                event.preventDefault();
              }
            }
          }

          // 创建绘制的图形,面要素
          function createGraphicPolygon (event) {
            const vertices = event.vertices;
            clearGraphics(); //清除
            const graphic = new Graphic({
              geometry: {
                type: "polygon",
                rings: vertices,
                spatialReference: _store.mapView.spatialReference
              },
              symbol: {
                type: "simple-fill",
                color: [128, 128, 128, 0.3],
                outline: {
                  color: "#4169E1",
                  width: 1
                }
              }
            });
            _self.bufferGeometry = new Polygon({
              rings: vertices,
              spatialReference: _store.mapView.spatialReference
            });
            //_store.geoGraphicLayer.add(graphic);
          }

          // 创建绘制的图形,线要素
          function createGraphic (event) {
            const vertices = event.vertices;
            clearGraphics(); //清除

            const graphic = new Graphic({
              geometry: {
                type: "polyline",
                paths: vertices,
                spatialReference: _store.mapView.spatialReference
              },
              symbol: {
                type: "simple-line",
                color: "#FF8C00",
                width: 3,
                cap: "round",
                join: "round"
              }
            });
            _self.bufferGeometry = new Polyline({
              paths: vertices,
              spatialReference: _store.mapView.spatialReference
            });

            const intersectingSegment = getIntersectingSegment(
              graphic.geometry
            );

            if (intersectingSegment) {
              _store.geoGraphicLayer.addMany([graphic, intersectingSegment]);
            } else {
              _store.geoGraphicLayer.add(graphic);
            }
            return {
              selfIntersects: intersectingSegment
            };
          }

          function isSelfIntersecting (polyline) {
            if (polyline.paths[0].length < 3) {
              return false;
            }
            const line = polyline.clone();

            const lastSegment = getLastSegment(polyline);
            line.removePoint(0, line.paths[0].length - 1);
            return geometryEngine.crosses(lastSegment, line);
          }

          function getIntersectingSegment (polyline) {
            if (isSelfIntersecting(polyline)) {
              return new Graphic({
                geometry: getLastSegment(polyline),
                symbol: {
                  type: "simple-line",
                  style: "short-dot",
                  width: 3.5,
                  color: "yellow"
                }
              });
            }
            return null;
          }

          function getLastSegment (polyline) {
            const line = polyline.clone();
            const lastXYPoint = line.removePoint(0, line.paths[0].length - 1);
            const existingLineFinalPoint = line.getPoint(
              0,
              line.paths[0].length - 1
            );

            return {
              type: "polyline",
              spatialReference: _store.mapView.spatialReference,
              hasZ: false,
              paths: [
                [
                  [existingLineFinalPoint.x, existingLineFinalPoint.y],
                  [lastXYPoint.x, lastXYPoint.y]
                ]
              ]
            };
          }
          //清除绘制
          function clearGraphics () {
            if (_store.highlight) {
              _store.highlight.remove();
            }
            _store.geoGraphicLayer.removeAll();
          }
        });
    },

    //缓冲分析--绘制点
    drawBufferPoint () {
      let _self = this;
      let _store = this.$store.state.mapStore;
      this.esriLoader
        .loadModules(
          [
            "esri/views/draw/Draw",
            "esri/Graphic",
            "esri/geometry/geometryEngine"
          ]
        )
        .then(([Draw, Graphic, geometryEngine]) => {
          let draw = new Draw({
            view: _store.mapView
          });
          clearGraphics(); //清除
          const action = draw.create("point");
          _store.mapView.focus();
          action.on(["cursor-update"], createPointGraphic);
          action.on(["draw-complete"], drawComp);
          function drawComp (evt) {
            let coordinates = evt.coordinates;
            let point = {
              type: "point", // autocasts as /Point
              x: coordinates[0],
              y: coordinates[1],
              spatialReference: _store.mapView.spatialReference
            };
            var polySym = {
              type: "simple-fill",
              color: [128, 128, 128, 0.6],
              outline: {
                color: "#DB7093",
                width: 1
              }
            };
            //geodesicBuffer--4326或102100；buffer--非102100的PCS；GeometryService.buffer--非4326的GCS
            var buffer = geometryEngine.geodesicBuffer(
              point,
              _self.distanceValue / 1000,
              "kilometers"
            );
            _store.geoGraphicLayer.add(
              new Graphic({
                geometry: buffer,
                symbol: polySym
              })
            );
            _self.$root.eventBus.$emit("bufferComplete", buffer);
          }

          function createPointGraphic (evt) {
            let coordinates = evt.coordinates;
            clearGraphics(); //清除
            let point = {
              type: "point", // autocasts as /Point
              x: coordinates[0],
              y: coordinates[1],
              spatialReference: _store.mapView.spatialReference
            };

            var graphic = new Graphic({
              geometry: point,
              symbol: {
                type: "simple-marker", // autocasts as SimpleMarkerSymbol
                style: "square",
                color: "red",
                size: "16px",
                outline: {
                  // autocasts as SimpleLineSymbol
                  color: [255, 255, 0],
                  width: 3
                }
              }
            });
            _store.geoGraphicLayer.add(graphic);
          }

          //清除绘制
          function clearGraphics () {
            if (_store.highlight) {
              _store.highlight.remove();
            }
            _store.geoGraphicLayer.removeAll();
          }
        });
    },

    //可视化渲染，radio选项改变监听
    visualChange (val) {
      let _store = this.$store.state.mapStore;
      let _siteLayer = _store.siteLayer;
      let prenderer = null;
      switch (val) {
        case 0:
          _siteLayer.renderer = _store.originRender;
          break;
        case 1:
          prenderer = window.mapConfig.classBreakColorRender;
          _siteLayer.renderer = prenderer;
          break;
        case 2:
          prenderer = window.mapConfig.uniqueRender;
          _siteLayer.renderer = prenderer;
          break;
        case 3:
          prenderer = window.mapConfig.heamtmapRender;
          _siteLayer.renderer = prenderer;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style>
.analysisCollapse {
  padding: 0px 20px;
  width: 300px;
  height: 600px;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(230, 223, 223);
  z-index: 3000;
}
.bufferQueryContent {
  text-align: left;
  padding-top: 20px !important;
}
.titletxt {
  font-size: 15px;
  font-family: "微软雅黑";
  padding-top: 10px;
}
#div_xueli,
#div_mingzu {
  width: 300px;
  height: 290px;
}
</style>