/*
 * @Author: liwei@esrichina.com.cn 
 * @Date: 2019-06-25 10:12:00 
 * @Last Modified by: mikey
 * @Last Modified time: 2019-07-25 14:17:41
 */
<template>
  <el-button-group>
    <el-tooltip class="item"
                effect="dark"
                content="搜索"
                placement="bottom-start">
      <el-button @click="search"
                 plain
                 size="small"
                 icon="el-icon-search"></el-button>
    </el-tooltip>
    <el-tooltip class="item"
                effect="dark"
                content="图层/图例"
                placement="bottom-start">
      <el-button @click="layerLL"
                 plain
                 size="small"
                 icon="el-icon-document-copy"></el-button>
    </el-tooltip>
    <el-tooltip class="item"
                effect="dark"
                content="日光"
                placement="bottom-start">
      <el-button @click="shadow"
                 plain
                 size="small"
                 icon="el-icon-sunny"></el-button>
    </el-tooltip>
    <el-tooltip class="item"
                effect="dark"
                content="高程"
                placement="bottom-start">
      <el-button @click="ground"
                 plain
                 size="small"
                 icon="el-icon-set-up"></el-button>
    </el-tooltip>
    <el-dropdown @command="analysisCommand">
      <el-button plain
                 size="small">
        <i class="el-icon-data-analysis"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="measureD">测距</el-dropdown-item>
        <el-dropdown-item command="measureA">测面</el-dropdown-item>
        <el-dropdown-item command="sliceB">剖切</el-dropdown-item>
        <el-dropdown-item command="clear">清除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-button-group>
</template>

<script>
export default {
  data () {
    return {
      currentWidget: null
    };
  },
  mounted () { },
  methods: {
    removeWidget (widget) {
      const view = this.$store.state.sceneStore.sceneView;
      view.ui.remove(widget, "top-right");
    },
    home () {
      this.esriLoader
        .loadModules(["esri/widgets/Home"])
        .then(([Home]) => {
          const view = this.$store.state.sceneStore.sceneView;
          const homeWidget = new Home({
            id: "homeWidget",
            view: view
          });
          view.ui.add([
            {
              component: homeWidget,
              position: "top-left",
              index: 0
            }
          ]);
        });
    },
    search () {
      let _self = this;
      this.esriLoader
        .loadModules(["esri/widgets/Search"])
        .then(([Search]) => {
          const view = this.$store.state.sceneStore.sceneView;
          if (_self.currentWidget) {
            if (_self.currentWidget.id == "searchWidget") {
              _self.removeWidget(_self.currentWidget);
              _self.currentWidget = null;
              return;
            } else {
              _self.removeWidget(_self.currentWidget);
              _self.currentWidget = null;
            }
          }

          _self.currentWidget = new Search({
            id: "searchWidget",
            view: view
          });
          view.ui.add(_self.currentWidget, {
            position: "top-right"
          });
        });
    },
    layerLL () {
      let _self = this;
      this.esriLoader
        .loadModules(["esri/widgets/LayerList"])
        .then(([LayerList]) => {
          const view = this.$store.state.sceneStore.sceneView;
          if (_self.currentWidget) {
            if (_self.currentWidget.id == "LayerListWidget") {
              _self.removeWidget(_self.currentWidget);
              _self.currentWidget = null;
              return;
            } else {
              _self.removeWidget(_self.currentWidget);
              _self.currentWidget = null;
            }
          }

          _self.currentWidget = new LayerList({
            id: "LayerListWidget",
            view: view,
            listItemCreatedFunction: function (event) {
              const item = event.item;
              if (item.layer.type != "group") {
                item.panel = {
                  content: "legend",
                  open: false
                };
              }
            }
          });
          view.ui.add(_self.currentWidget, {
            position: "top-right"
          });
        });
    },
    shadow () {
      const view = this.$store.state.sceneStore.sceneView;
      view.environment.lighting.date = Date.now();
      view.environment.lighting.directShadowsEnabled = !view.environment
        .lighting.directShadowsEnabled;
    },
    ground () {
      const view = this.$store.state.sceneStore.sceneView;
      view.map.ground.layers.forEach(function (layer) {
        layer.visible = !layer.visible;
      });
    },
    analysisCommand (command) {
      let _self = this;
      switch (command) {
        case "measureD":
          this.esriLoader
            .loadModules(["esri/widgets/DirectLineMeasurement3D"])
            .then(([DirectLineMeasurement3D]) => {
              const view = this.$store.state.sceneStore.sceneView;

              if (_self.currentWidget) {
                if (_self.currentWidget.id == "directLineMeasureWidget") {
                  _self.removeWidget(_self.currentWidget);
                  _self.currentWidget = null;
                  return;
                } else {
                  _self.removeWidget(_self.currentWidget);
                  _self.currentWidget = null;
                }
              }

              _self.directLineMeasureWidget = _self.currentWidget = new DirectLineMeasurement3D(
                {
                  id: "directLineMeasureWidget",
                  view: view
                }
              );

              _self.currentWidget.viewModel.newMeasurement();
              view.ui.add(_self.currentWidget, "top-right");
            });
          break;
        case "measureA":
          this.esriLoader
            .loadModules(["esri/widgets/AreaMeasurement3D"])
            .then(([AreaMeasurement3D]) => {
              const view = this.$store.state.sceneStore.sceneView;

              if (_self.currentWidget) {
                if (_self.currentWidget.id == "areaMeasurement") {
                  _self.removeWidget(_self.currentWidget);
                  _self.currentWidget = null;
                  return;
                } else {
                  _self.removeWidget(_self.currentWidget);
                  _self.currentWidget = null;
                }
              }

              _self.areaMeasurement = _self.currentWidget = new AreaMeasurement3D(
                {
                  id: "areaMeasurement",
                  view: view
                }
              );

              _self.currentWidget.viewModel.newMeasurement();
              view.ui.add(_self.currentWidget, "top-right");
            });
          break;
        case "sliceB":
          this.esriLoader
            .loadModules(["esri/widgets/Slice"])
            .then(([Slice]) => {
              const view = this.$store.state.sceneStore.sceneView;

              if (_self.currentWidget) {
                if (_self.currentWidget.id == "sliceWidget") {
                  _self.removeWidget(_self.currentWidget);
                  _self.currentWidget = null;
                  return;
                } else {
                  _self.removeWidget(_self.currentWidget);
                  _self.currentWidget = null;
                }
              }

              _self.sliceWidget = _self.currentWidget = new Slice({
                id: "sliceWidget",
                view: view
              });

              _self.currentWidget.viewModel.newSlice();
              view.ui.add(_self.currentWidget, "top-right");
            });
          break;
        case "clear":
          if (_self.directLineMeasureWidget) {
            _self.directLineMeasureWidget.destroy();
          }
          if (_self.areaMeasurement) {
            _self.areaMeasurement.destroy();
          }
          if (_self.sliceWidget) {
            _self.sliceWidget.destroy();
          }
          break;
      }
    }
  },
  computed: {
    listenSceneView () {
      return this.$store.state.sceneStore.sceneView;
    }
  },
  watch: {
    listenSceneView (newVal, oldVal) {
      if (newVal) {
        this.home();
      }
    }
  }
};
</script>

<style scoped>
</style>



