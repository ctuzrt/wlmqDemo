<template>
  <!-- 工具栏 -->
  <div>
    <el-button-group id="toolbar">
      <el-tooltip class="item"
                  effect="dark"
                  content="距离测量"
                  placement="bottom-start">
        <el-button size="medium"
                   type="primary"
                   icon="el-icon-files"
                   @click="distanceMeasure"
                   class="btnclass"></el-button>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  content="面积测量"
                  placement="bottom-start">
        <el-button size="medium"
                   type="primary"
                   icon="el-icon-house"
                   @click="areaMeasure"
                   class="btnclass"></el-button>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  content="图层"
                  placement="bottom-start">
        <el-button size="medium"
                   type="primary"
                   icon="el-icon-view"
                   @click="createLayerlist"
                   class="btnclass"></el-button>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  content="图例"
                  placement="bottom-start">
        <el-button size="medium"
                   type="primary"
                   icon="el-icon-date"
                   @click="createLegend"
                   class="btnclass"></el-button>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  content="打印"
                  placement="bottom-start">
        <el-button size="medium"
                   type="primary"
                   icon="el-icon-printer"
                   @click="createPrint"
                   class="btnclass"></el-button>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  content="分析"
                  placement="bottom-start">
        <el-button size="medium"
                   type="primary"
                   icon="el-icon-discount"
                   @click="createAnalysis"
                   class="btnclass"></el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>
<script>
export default {
  data () {
    return {
      view: null,
      webmap: null,
      currentWidget: null
    };
  },
  components: {},
  watch: {},
  methods: {
    createAnalysis () {
      this.$emit("showComp", { flag: true });
    },
    removeWidget () {
      if (this.currentWidget) {
        this.view.ui.remove(this.currentWidget);
        this.currentWidget.destroy();
        this.currentWidget = null;
      }
    },
    //二维距离测量
    distanceMeasure () {
      let _self = this;
      if (_self.currentWidget) {
        if (_self.currentWidget.id == "distance") {
          this.removeWidget();
          return;
        } else {
          this.removeWidget();
        }
      }
      this.esriLoader
        .loadModules(
          [
            "esri/views/MapView",
            "esri/WebMap",
            "esri/widgets/DistanceMeasurement2D",
            "esri/widgets/AreaMeasurement2D"
          ]
        )
        .then(function ([
          MapView,
          WebMap,
          DistanceMeasurement2D,
          AreaMeasurement2D
        ]) {
          _self.currentWidget = new DistanceMeasurement2D({
            id: "distance",
            view: _self.view
          });
          _self.currentWidget.viewModel.newMeasurement();

          _self.view.ui.add(_self.currentWidget, "top-right");
        });
    },
    //二维面积测量
    areaMeasure () {
      let _self = this;
      if (_self.currentWidget) {
        if (_self.currentWidget.id == "area") {
          this.removeWidget();
          return;
        } else {
          this.removeWidget();
        }
      }
      this.esriLoader
        .loadModules(
          [
            "esri/views/MapView",
            "esri/WebMap",
            "esri/widgets/DistanceMeasurement2D",
            "esri/widgets/AreaMeasurement2D"
          ]
        )
        .then(function ([
          MapView,
          WebMap,
          DistanceMeasurement2D,
          AreaMeasurement2D
        ]) {
          _self.currentWidget = new AreaMeasurement2D({
            id: "area",
            view: _self.view
          });
          _self.currentWidget.viewModel.newMeasurement();

          _self.view.ui.add(_self.currentWidget, "top-right");
        });
    },
    //二维图层列表
    createLayerlist () {
      let _self = this;
      if (_self.currentWidget) {
        if (_self.currentWidget.id == "layerList") {
          this.removeWidget();
          return;
        } else {
          this.removeWidget();
        }
      }
      this.esriLoader
        .loadModules(
          ["esri/views/MapView", "esri/widgets/LayerList", "esri/WebMap"]
        )
        .then(([MapView, LayerList, WebMap]) => {
          _self.currentWidget = new LayerList({
            id: "layerList",
            view: _self.view
          });
          _self.view.ui.add(_self.currentWidget, "top-right");
        });
    },
    //二维图例
    createLegend () {
      let _self = this;
      if (_self.currentWidget) {
        if (_self.currentWidget.id == "legend") {
          this.removeWidget();
          return;
        } else {
          this.removeWidget();
        }
      }
      this.esriLoader
        .loadModules(
          ["esri/views/MapView", "esri/widgets/Legend", "esri/WebMap"]
        )
        .then(([MapView, Legend, WebMap]) => {
          let legend = null;
          if (_self.webmap == null) return;
          const featureLayer = _self.webmap.layers.getItemAt(0);
          _self.currentWidget = new Legend({
            id: "legend",
            view: _self.view
          });
          _self.view.ui.add(_self.currentWidget, "bottom-left");
        });
    },
    //二维打印
    createPrint () {
      let _self = this;
      if (_self.currentWidget) {
        if (_self.currentWidget.id == "print") {
          this.removeWidget();
          return;
        } else {
          this.removeWidget();
        }
      }
      this.esriLoader
        .loadModules(
          ["esri/views/MapView", "esri/widgets/Print", "esri/WebMap"]
        )
        .then(([MapView, Print, WebMap]) => {
          _self.currentWidget = new Print({
            id: "print",
            view: _self.view,
            printServiceUrl:
              "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
          });
          _self.view.ui.add(_self.currentWidget, "top-right");
        });
    },
    //二维比例尺
    createScalebar () {
      let _self = this;
      this.esriLoader
        .loadModules(
          ["esri/views/MapView", "esri/widgets/ScaleBar", "esri/WebMap"]
        )
        .then(([MapView, ScaleBar, WebMap]) => {
          _self.scalebar = new ScaleBar({
            view: _self.view,
            unit: "dual" // The scale bar displays both metric and non-metric units.
          });

          _self.view.ui.add(_self.scalebar, "bottom-left");
        });
    }
  },

  mounted () {
    // this.$store.state.mapStore.mapView.ui.add("analysiscomp", "top-right");
  },
  computed: {
    listenMapView () {
      return this.$store.state.mapStore.mapView;
    }
  },
  watch: {
    listenMapView (newVal, oldVal) {
      if (newVal) {
        this.view = this.$store.state.mapStore.mapView;
        this.webmap = this.$store.state.mapStore.webmap;
        this.createScalebar();
        this.view.ui.add("toprightDiv", "top-right");
      }
    }
  }
};
</script>
<style scoped>
.analysisclass {
  width: 330px;
  height: 600px;
}
</style>