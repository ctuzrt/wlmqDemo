<template>
  <div id="viewDiv">
    <div id="toprightDiv"></div>
    <map-tools class="mapToolBar"
               @showComp="analysisShow"></map-tools>
    <!-- <base-map-tab class="baseMapTab"></base-map-tab> -->
    <search-input-bar class="searchBar"></search-input-bar>
    <div ref="analysisdiv">
      <analysis-component v-show="analysisshow"
                          class="analysisDiv"
                          @hideComp="analysisShow"></analysis-component>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import mapToolComponent from "../../components/map/mapToolsComponents";
import baseMapComponent from "../../components/map/baseMapComponents";
import searchInputBarComponent from "../../components/map/searchInputComponent";
import analysisComponent from "../../components/map/analysisComponent";
import Vue from "vue";

export default {
  data () {
    return {
      analysisshow: false,
      lastAnaVal: null //标记分析模块关闭时，选中的项
    };
  },
  components: {
    "map-tools": mapToolComponent,
    "base-map-tab": baseMapComponent,
    "search-input-bar": searchInputBarComponent,
    "analysis-component": analysisComponent
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    this.$store.state.mapStore.analysiswidget = this.$refs.analysisdiv;
    this.loadTileMap();
  },
  methods: {
    ...mapMutations(["loadTileMap"]),

    //分析模块界面的打开和关闭。
    analysisShow (paramObj) {
      if (!paramObj.flag) {
        //关闭。记录关闭时刻，最终选择项停留的位置，如果是visual，再打开时，加载legend
        this.lastAnaVal = paramObj.val;
      }
      let _store = this.$store.state.mapStore;
      this.analysisshow = paramObj.flag;
      if (paramObj.flag && this.lastAnaVal == "visual") {
        //1.打开，2.上次关闭停留在visual
        _store.mapView.ui.add(_store.siteLegend, "bottom-left");
      }
    }
  }
};
</script>

<style>
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
.searchBar {
  position: fixed;
  left: 20px;
  top: 20px;
}

.analysisDiv {
  position: fixed;
  right: 20px;
  top: 80px;
}
.mapToolBar {
  position: fixed;
  right: 20px;
  top: 20px;
}
.baseMapTab {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
#toprightDiv {
  height: 40px;
}
</style>