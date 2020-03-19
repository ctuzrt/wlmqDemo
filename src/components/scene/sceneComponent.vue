/*
 * @Author: liwei@esrichina.com.cn 
 * @Date: 2019-06-15 01:31:12 
 * @Last Modified by: liwei@esrichina.com.cn
 * @Last Modified time: 2019-06-26 17:18:15
 */
<template>
  <div id="view3Div">
    <scenetools-component id="sceneTools"></scenetools-component>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import sceneToolsComponent from "./sceneToolsComponent";
export default {
  components: {
    "scenetools-component": sceneToolsComponent
  },
  data () {
    return {};
  },
  created () {
    this.setSceneView(null);
    let routeName = this.$route.name;
    switch (routeName) {
      case "scene":
        this.loadScene();
        break;
      case "webScene":
        this.loadWebScene();
        break;
      default:
        this.loadScene();
    }
  },
  destroyed () { },
  computed: {},
  methods: {
    ...mapMutations(["setSceneView", "loadScene", "loadWebScene"])
  },
  computed: {
    listenSceneView () {
      return this.$store.state.sceneStore.sceneView;
    }
  },
  watch: {
    listenSceneView (newVal, oldVal) {
      if (newVal) {
        newVal.ui.add("sceneTools", "top-right");
      }
    },
    $route (to, from) {
      let routeName = to.name;
      switch (routeName) {
        case "scene":
          this.loadScene();
          break;
        case "webScene":
          this.loadWebScene();
          break;
        default:
          this.loadScene();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#view3Div {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
