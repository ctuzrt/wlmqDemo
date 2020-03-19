<template>
  <!-- 底图切换 -->
  <div id="baseMapContainer">
    <div class="mapborder tile-border">
      <img :src="tileSrc"
           class="mapimg"
           @click="basemapChangeClick('tile')" />
      <p class="fontp">切片</p>
    </div>
    <div class="mapborder vtile-border">
      <img :src="vectortileSrc"
           class="mapimg"
           @click="basemapChangeClick('vectortile')" />
      <p class="fontp">矢量切片</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data () {
    return {
      currentmap: "tile",
      tileSrc: require("../../assets/images/tool/tile.png"),
      vectortileSrc: require("../../assets/images/tool/vectortile.png")
    };
  },

  watch: {
    currentmap: function (newVal, oldVal) {
      this.basemapChange({
        "newmap": newVal,
        "oldmap": oldVal
      });
    }
  },
  methods: {
    ...mapMutations(["basemapChange"]),//将 `this.basemapChange(obj)` 映射为 `this.$store.commit(obj)`
    basemapChangeClick (type) {
      this.currentmap = type;
    }
  }
};
</script>

<style>
#baseMapContainer {
  width: 150px;
  height: 55px;
  margin: 0 auto;
}

.mapborder {
  width: 70px;
  height: 80px;
  text-align: center;
}

.mapimg:hover {
  transform: translateY(-3px);
  transition: all 0.1s;
}

.mapborder p {
  position: absolute;
  z-index: 1000;
  margin-top: -22px;
  background-color: rgba(54, 54, 53, 0.5);
  color: rgb(255, 255, 255);
  width: 100%;
}

.tile-border {
  position: absolute;
  left: 3px;
  top: 0px;
}

.vtile-border {
  position: absolute;
  left: 80px;
  top: 0px;
}
.fontp {
  font-size: 12px;
}

img {
  border-radius: 8px;
  cursor: pointer;
}
</style>