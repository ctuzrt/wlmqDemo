/*
* @Author: liwei@esrichina.com.cn
* @Date: 2019-06-15 01:31:04
* @Last Modified by: liwei@esrichina.com.cn
* @Last Modified time: 2019-06-24 19:14:23
*/
<template>
  <!-- 地图容器 -->
  <div id="viewDiv"
       ref="viewDiv">
    <map-tools></map-tools>
  </div>
</template>

<script>
import maptoolscomponents from "./mapToolsComponents";
import { mapState, mapMutations } from "vuex";
export default {
  data () {
    return {
      view: null,
    };
  },
  components: {
    "map-tools": maptoolscomponents
  },
  computed: {
  },
  created () {
    this.setMapView(null);
    let routeName = this.$route.name;
    switch (routeName) {
      case "tileMap":
        this.loadTileMap();
        break;
      case "vectorTileMap":
        break;
      case "tdtWMTS":
        this.loadTdtWMTS();
        break;
      case "dynamicMap":
        break;
      case "imageMap":
        break;
      case "webMap":
        this.loadWebMap();
        break;
      case "webMapValue":
        this.loadWebMapValue();
        break;
      default:
        this.loadTileMap();
    }
  },
  destroyed () { },
  mounted () {
    let viewdiv = this.$refs.viewDiv;
    this.setviewDiv(viewdiv);//获取map的div元素，用于全屏插件绑定
  },
  methods: {
    ...mapMutations(["setMapView", "loadTileMap", "loadTdtWMTS", "loadWebMap", "loadWebMapValue", "loadWebMapColor", "loadWebMapSize", "setviewDiv"])
  },
  watch: {
    $route (to, from) {
      let routeName = to.name;
      switch (routeName) {
        case "tileMap":
          this.loadTileMap();
          break;
        case "vectorTileMap":
          break;
        case "tdtWMTS":
          this.loadTdtWMTS();
          break;
        case "dynamicMap":
          break;
        case "imageMap":
          break;
        case "webMap":
          this.loadWebMap();
          break;
        case "webMapValue":
          this.loadWebMapValue();
          break;
        case "webMapColor":
          this.loadWebMapColor();
          break;
        case "webMapSize":
          this.loadWebMapSize();
          break;
        default:
          this.loadTileMap();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>