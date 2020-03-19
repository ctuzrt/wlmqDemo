<template>
  <!-- 要素查询模块 -->
  <div id="searchInputBar">
    <el-input placeholder="请输入居民姓名"
              v-model="siteNameVal"
              class="input-with-select"
              @click.native="changeResultDivShow">
      <el-button slot="append"
                 icon="el-icon-search"
                 @click="searchClick"
                 class="searchbtn"></el-button>
    </el-input>
    <!-- 整体seachBox -->
    <div v-show="seachBoxshow"
         class="seachBoxDiv">
      <!-- 查询结果列表box -->
      <el-card class="resultCard"
               v-show="resultBoxShow">
        <div slot="header">
          <span v-show="totalnumflag">正在查询...</span>
          <span v-show="!totalnumflag">
            共有
            <span style="color:#FF0000;font-weight:bold">{{totalResultNum}}</span>条结果
          </span>
          <el-button style="float: right; padding: 3px 0"
                     icon="el-icon-circle-close"
                     type="text"
                     @click.native="hideResultBox" />
        </div>
        <!-- 结果列表 -->
        <div class="resultListBorder">
          <div class="listitemdiv"
               v-for="(val,index) in currentResultLists"
               :key="index">
            <img :src="resultlistlogo"
                 class="resultlogo" />
            <span class="resulttext"
                  @click="resultItemClick"
                  :id="val.attributes.OBJECTID">
              <span class="fieldInfoTitle">姓名：{{val.attributes.Name}}</span>
              <span class="fieldInfoValue">民族：{{val.attributes.Zb}}</span>

              <br />
              <span class="fieldInfoTitle">门牌号：{{val.attributes.MPNo}}</span>
              <span class="fieldInfoValue">学历：{{val.attributes.XueL}}</span>
            </span>
          </div>
        </div>
        <!-- 分页 -->
        <div class="paginationbar">
          <el-pagination background
                         ref="pagebar"
                         layout="prev, pager, next"
                         small
                         :page-size="pagesize"
                         :current-page="currentpage"
                         :pager-count="5"
                         :total="totalResultNum"
                         @current-change="pagechange"></el-pagination>
        </div>
      </el-card>
      <!-- tab选项卡 -->
      <el-tabs v-model="activeName"
               v-show="tabBoxShow"
               class="tabBox"
               @tab-click="searchTabChange">
        <el-tab-pane label="空间查询"
                     name="geometry">
          <div class="geoQueryContent">
            <div class="title">
              当前位置：
              <span class="titlespan">{{titleRegionName}}</span>
            </div>
            <div class="regionContent">
              <div v-for="(val,index) in citylists"
                   :key="index"
                   class="regionItem">
                <div class="city"
                     :id="val.code"
                     @click="regionChoose">{{val.name}}</div>
                <div class="counties">
                  <span v-for="(val2,index2) in val.area"
                        :key="index2"
                        class="county"
                        :id="val2.code"
                        @click="regionChoose">{{val2.name}}</span>
                </div>
              </div>
            </div>
            <div class="graQueryContent">
              <span style="font-size:12px;padding-right:10px">图形查询：</span>
              <i class="el-icon-orange"
                 style="padding-right:5px;cursor:pointer"
                 @click="geomSearchClick('circle')" />
              <i class="el-icon-house"
                 style="padding-left:20px;cursor:pointer"
                 @click="geomSearchClick('polygon')" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="属性查询"
                     name="attribute">
          <el-form ref="attForm"
                   :model="sizeForm"
                   label-width="70px"
                   size="mini"
                   class="attpanel">
            <el-form-item label="姓名"
                          prop="siteName">
              <el-input v-model="sizeForm.siteName"></el-input>
            </el-form-item>
            <el-form-item label="楼栋号"
                          prop="siteName">
              <el-input v-model="sizeForm.siteName"></el-input>
            </el-form-item>
            <el-form-item label="门牌号"
                          prop="siteName">
              <el-input v-model="sizeForm.siteName"></el-input>
            </el-form-item>
            <el-form-item label="性别"
                          prop="siteCode">
              <el-select v-model="sizeForm.grade"
                         placeholder="请选择性别">
                <el-option label="男"
                           value="男"></el-option>
                <el-option label="女"
                           value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学历"
                          prop="grade">
              <el-select v-model="sizeForm.grade"
                         placeholder="请选择学历">
                <el-option label="高中"
                           value="1"></el-option>
                <el-option label="本科"
                           value="2"></el-option>
                <el-option label="硕士"
                           value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="民族"
                          prop="siteType">
              <el-select v-model="sizeForm.siteType"
                         placeholder="请选择民族">
                <el-option label="全部"
                           value="all"></el-option>
                <el-option label="汉族"
                           value="汉"></el-option>
                <el-option label="回族"
                           value="回"></el-option>
                <el-option label="维族"
                           value="维"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="政治面貌"
                          prop="industryUnit">
              <el-select v-model="sizeForm.industryUnit"
                         placeholder="请选择政治面貌">
                <el-option label="党员"
                           value="党员"></el-option>
                <el-option label="群众"
                           value="群众"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini">
              <el-button type="primary"
                         @click="attQuery">查询</el-button>
              <el-button @click="attReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑要素弹出框 -->
    <dialog-bar></dialog-bar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import dialogBar from "../map/dialogComponent";

export default {
  components: {
    "dialog-bar": dialogBar
  },
  data () {
    return {
      sendVal: null,
      titleRegionName: null,
      citylists: null,
      totalnumflag: true,
      resultlistlogo: require("../../assets/images/tool/locate.png"),
      currentResultLists: null,
      searchShowText: "正在查询...",
      totalResultNum: 0,
      siteNameVal: "",
      seachBoxshow: false,
      resultBoxShow: false,
      tabBoxShow: true,
      activeName: "geometry",
      pagesize: 10,
      currentpage: 1,
      sizeForm: {
        siteName: "",
        siteCode: "",
        grade: "3",
        siteType: "PP",
        industryUnit: "陕西水文",
        adminUnit: "西安水情分中心",
        date1: "",
        data2: ""
      }
    };
  },
  created () {
    let _self = this;
    this.$root.eventBus.$on("bufferComplete", this.bufferCompleteFunc); //兄弟组件传值方式。事件派发监听。
  },
  computed: {
    getSearchResult () {
      return this.$store.state.mapStore.totalResults;
    }
  },
  watch: {
    getSearchResult (newVal, oldVal) {
      if (newVal != null) {
        this.currentpage = 1;
        let arr = [];
        this.totalResultNum = newVal.features.length;
        let resultArr = newVal.features;
        let maxnum =
          this.pagesize > this.totalResultNum
            ? this.totalResultNum
            : this.pagesize;

        for (var i = 0; i < maxnum; i++) {
          arr.push(resultArr[i]);
        }

        this.currentResultLists = arr;
        this.totalnumflag = false;
      } else {
        console.log("111---");
      }
    }
  },
  methods: {
    ...mapMutations(["searchByAttribute", "geomSearch"]),

    //search框tab页切换
    searchTabChange (val) { },
    //属性查询
    attQuery () {
      this.resultBoxShow = true;
      this.tabBoxShow = false;
      this.totalnumflag = true;
      this.searchShowText = "正在查询...";
      this.currentResultLists = null;

      let pwhere = " 1=1 ";
      if (this.sizeForm.siteName.length > 0)
        pwhere += " and STNM like '%" + this.sizeForm.siteName + "%'";
      if (this.sizeForm.siteCode.length > 0)
        pwhere += " and STCD like '%" + this.sizeForm.siteCode + "%'";
      pwhere +=
        " and FRGRD='" +
        this.sizeForm.grade +
        "' and STTP='" +
        this.sizeForm.siteType +
        "' and ATCUNIT ='" +
        this.sizeForm.industryUnit +
        "' and ADMAUTH='" +
        this.sizeForm.adminUnit +
        "'";
      this.searchByAttribute({
        pwhere: pwhere
      });
    },

    //属性查询-重置
    attReset () {
      console.log("aaaa");
      this.$refs["attForm"].resetFields();
    },

    //监听分析模块中，缓冲区构建完成的成功响应
    bufferCompleteFunc (pgeometry) {
      this.seachBoxshow = true;
      this.resultBoxShow = true;
      this.tabBoxShow = false;
      this.totalnumflag = true;
      this.searchShowText = "正在查询...";
      this.currentResultLists = null;
      let _store = this.$store.state.mapStore;
      this.$options.methods.selectFeatures(pgeometry, _store, false);
    },

    //空间查询中，选定小区楼栋
    regionChoose (event) {
      let id = event.target.id;
      console.log(id);
      let _store = this.$store.state.mapStore;

      this.seachBoxshow = true;
      this.resultBoxShow = true;
      this.tabBoxShow = false;
      this.totalnumflag = true;
      this.searchShowText = "正在查询...";
      this.currentResultLists = null;

      _store.mapView.zoom = window.mapConfig.zoom;
      _store.mapView.center = [
        window.mapConfig.center.x,
        window.mapConfig.center.y
      ];

      let pwhere = "";
      let last = id.substring(4, 6);
      let start = id.substring(0, 4);
      if (last == "00") {
        // 最后两位是"00"，说明是小区
        pwhere += " code like '%" + start + "%'";
      } else {
        // 否则当楼栋处理
        pwhere += " code like '%" + id + "%'";
      }
      this.searchByAttribute({
        pwhere: pwhere
      });
    },

    //查询结果列表项单击
    resultItemClick (evl) {
      let _store = this.$store.state.mapStore;
      let _self = this;
      let itemFID = evl.currentTarget.id;
      _self.esriLoader
        .loadModules(["esri/PopupTemplate", "esri/Graphic"])
        .then(function ([PopupTemplate, Graphic]) {
          _self.currentResultLists.forEach((val, index) => {
            if (val.attributes.OBJECTID == itemFID) {
              let editThisAction = {
                title: "编辑",
                id: "edit-this",
                className: "esri-icon-edit"
              };
              let gra = new Graphic({
                geometry: val.geometry,
                attributes: val.attributes
              });
              gra.popupTemplate = _store.popupTemplate;
              let graphics = [gra];
              _store.mapView.popup.open({
                title: "ffff",
                // fetchFeatures:true,//为true时，content匹配layer上的PopupTemplate的content
                location: val.geometry,
                features: graphics
              });
              _store.mapView.center = val.geometry;
            }
          });
        });
    },

    //查询结果页码改变
    pagechange (pageIndex) {
      let arr = [];
      let totalarr = this.$store.state.mapStore.totalResults.features;
      let maxnum =
        pageIndex * this.pagesize > totalarr.length
          ? totalarr.length
          : pageIndex * this.pagesize;
      for (var i = (pageIndex - 1) * this.pagesize; i < maxnum; i++) {
        arr.push(totalarr[i]);
      }
      this.currentResultLists = arr;
    },

    //空间查询，绘制图形图标点击
    geomSearchClick (type) {
      let _store = this.$store.state.mapStore;
      let _self = this;
      _self.esriLoader
        .loadModules(["esri/widgets/Sketch/SketchViewModel", "esri/Graphic"])
        .then(function ([SketchViewModel, Graphic]) {
          if (_store.highlight) {
            _store.highlight.remove();
          }
          _store.mapView.popup.close();
          _store.geoGraphicLayer.removeAll();
          _store.mapView.map.add(_store.geoGraphicLayer);
          let sketchViewModel = new SketchViewModel({
            view: _store.mapView,
            layer: _store.geoGraphicLayer,
            pointSymbol: {
              type: "simple-marker",
              color: [255, 255, 255, 0],
              size: "1px",
              outline: {
                color: "red",
                width: 0
              }
            }
          });

          sketchViewModel.create(type);
          sketchViewModel.on("create", function (event) {
            if (event.state === "complete") {
              console.log("bbbbbbbbbbbbbbb");
              //图形绘制完毕
              _self.tabBoxShow = false;
              _self.resultBoxShow = true;
              _self.tabBoxShow = false;
              _self.totalnumflag = true;
              _self.searchShowText = "正在查询...";
              _self.currentResultLists = null;
              _self.$options.methods.selectFeatures(
                event.graphic.geometry,
                _store,
                true
              );
            }
          });
        });
    },

    //抽离空间查询中，根据geometry查询的方法。
    selectFeatures (geometry, _store, clearFlag) {
      const query = {
        geometry: geometry,
        outFields: ["*"],
        returnGeometry: true
      };
      _store.siteLayer.queryFeatures(query).then(function (results) {
        _store.totalResults = results;
        _store.mapView
          .whenLayerView(_store.siteLayer)
          .then(function (layerview) {
            const graphics = results.features;
            //高亮查询结果
            _store.highlight = layerview.highlight(graphics);
          });
        if (clearFlag) {
          _store.geoGraphicLayer.removeAll();
        }
      });
    },

    //搜索文本框获取焦点，切换seachBoxshow的可见性
    changeResultDivShow () {
      if (!this.resultBoxShow) {
        this.seachBoxshow = !this.seachBoxshow;
      }
    },

    //搜索框查询按钮点击
    searchClick () {
      let _store = this.$store.state.mapStore;
      if (_store.highlight) {
        _store.highlight.remove();
      }
      _store.geoGraphicLayer.removeAll();
      _store.mapView.popup.close();
      this.seachBoxshow = true;
      this.resultBoxShow = true;
      this.tabBoxShow = false;
      this.totalnumflag = true;
      this.searchShowText = "正在查询...";
      this.currentResultLists = null;
      this.searchByAttribute({
        pwhere: " STNM like '%" + this.siteNameVal + "%'"
      });
    },

    //关闭查询结果列表
    hideResultBox () {
      this.resultBoxShow = false;
      this.tabBoxShow = true;
      this.currentResultLists = null;
      let _store = this.$store.state.mapStore;
      if (_store.highlight) {
        _store.highlight.remove();
      }
      _store.geoGraphicLayer.removeAll();
      _store.mapView.popup.close();
    }
  },
  mounted () {
    let allcity = window.cityConfig;
    this.citylists = allcity.city;
    this.titleRegionName = allcity.name;
  }
};
</script>

<style scoped>
#searchInputBar {
  width: 412px;
}

.seachBoxDiv {
  border: 1px solid rgb(214, 212, 212);
  width: 340px;
  height: 575px;
  background-color: rgba(201, 214, 181, 0.5);
}

.listitemdiv {
  display: flex;
  align-items: flex-start;
  width: 100%;
  cursor: pointer;
}

.resulttext:hover {
  background-color: rgba(169, 169, 169, 0.5);
}

.resultlogo {
  padding-top: 2px;
  float: left;
}

.resulttext {
  padding-left: 10px;
  float: left;
}

.resultListBorder {
  margin-left: 0px;
  width: 100%;
  height: 455px;
  overflow-y: auto;
}

.input-with-select {
  background-color: #fff;
  height: 40px;
}
.tabBox,
.resultCard {
  width: 300px;
  height: 575px;
  background-color: white;
  padding-left: 20px;
  padding-right: 20px;
}

.resultCard {
  width: 340px;
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.paginationbar {
  margin-top: 10px;
  text-align: center;
}

.searchbtn {
  background-color: #2577f3 !important;
  border-radius: 0px;
  width: 70px;
  height: 40px;
}

.geoQueryContent {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0 10px 2px rgba(31, 51, 73, 0.1);
  border-radius: 3px;
  color: #999;
  box-sizing: border-box;
  padding: 6px;
  text-align: center;
  min-height: 300px;
}
.regionContent {
  width: 100%;
  max-height: 400px;
  overflow: auto;
}
.regionItem {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #ededed;
}

.city {
  width: 60px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}
.city:hover {
  color: #0f89f5;
}

.counties {
  position: relative;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}
.county {
  font-size: 12px;
  padding: 3px 6px;
  cursor: pointer;
}
.county:hover {
  color: #0f89f5;
}

.title {
  flex: 1;
  line-height: 30px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 700;
  font-size: 12px;
}
.graQueryContent {
  text-align: left;
  padding-top: 20px !important;
}
.attpanel {
  padding-top: 15px;
  padding-left: 0px !important;
}

.fieldInfoTitle,
.fieldInfoValue {
  font-family: 微软雅黑;
  font-size: 12px;
}
.fieldInfoTitle {
  width: 170px;
}
.fieldInfoValue {
  padding-left: 20px;
}
</style>