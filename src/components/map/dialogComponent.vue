<template>
  <!-- 编辑要素，弹出框 -->
  <div class="dialog"
       v-show="showMask">
    <div class="dialog-container">
      <div class="content">
        <el-form ref="attForm"
                 :model="sizeForm"
                 label-width="70px"
                 size="mini"
                 class="attpanel">
          <el-form-item label="测点名称"
                        prop="STNM">
            <el-input v-model="sizeForm.STNM"></el-input>
          </el-form-item>
          <el-form-item label="测点编码"
                        prop="STCD">
            <el-input v-model="sizeForm.STCD"></el-input>
          </el-form-item>
          <el-form-item label="报讯等级"
                        prop="FRGRD">
            <el-select v-model="sizeForm.FRGRD"
                       placeholder="请选择报讯等级">
              <el-option label="等级1"
                         value="1"></el-option>
              <el-option label="等级2"
                         value="2"></el-option>
              <el-option label="等级3"
                         value="3"></el-option>
              <el-option label="等级4"
                         value="4"></el-option>
              <el-option label="等级5"
                         value="5"></el-option>
              <el-option label="等级6"
                         value="6"></el-option>
              <el-option label="等级7"
                         value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站场类别"
                        prop="STTP">
            <el-select v-model="sizeForm.STTP"
                       placeholder="请选择站场类别">
              <el-option label="PP"
                         value="PP"></el-option>
              <el-option label="MM"
                         value="MM"></el-option>
              <el-option label="RR"
                         value="RR"></el-option>
              <el-option label="ZZ"
                         value="ZZ"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业单位"
                        prop="ATCUNIT">
            <el-select v-model="sizeForm.ATCUNIT"
                       placeholder="请选择隶属行业单位">
              <el-option label="陕西水文"
                         value="陕西水文"></el-option>
              <el-option label="陕西水利"
                         value="陕西水利"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="管理单位"
                        prop="ADMAUTH">
            <el-select v-model="sizeForm.ADMAUTH"
                       placeholder="请选择信息管理单位">
              <el-option label="西安水情分中心"
                         value="西安水情分中心"></el-option>
              <el-option label="安康水情分中心"
                         value="安康水情分中心"></el-option>
              <el-option label="商洛水情分中心"
                         value="商洛水情分中心"></el-option>
              <el-option label="延安水情分中心"
                         value="延安水情分中心"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="测站地址"
                        prop="STLC">
            <el-input v-model="sizeForm.STLC"></el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary"
                       @click="clickCancle">取消</el-button>
            <el-button @click="clickSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  data () {
    return {
      showMask: null,
      sizeForm: {
        STNM: "",
        STCD: "",
        FRGRD: "",
        STTP: "",
        ATCUNIT: "",
        ADMAUTH: "",
        STLC: ""
      }
    };
  },
  methods: {
    //关闭弹出框
    closeMask () {
      this.$store.state.mapStore.dialogShowFlag = false;
    },
    //取消点击
    clickCancle () {
      let _store = this.$store.state.mapStore;
      this.closeMask();
      _store.mapView.popup.open({
        features: [_store.selectedFeature]
      });
    },
    //获取编辑后的要素
    getEditFeature () {
      let _self = this;
      let editParams;
      let _store = this.$store.state.mapStore;
      // 循环键，给editFeature赋属性
      Object.keys(this.sizeForm).forEach(function (name) {
        _store.selectedFeature.attributes[name] = _self.sizeForm[name];
      });
      editParams = {
        updateFeatures: [_store.selectedFeature]
      };
      return editParams;
    },
    //提交点击
    clickSubmit () {
      let _store = this.$store.state.mapStore;
      let editParams = this.getEditFeature();
      this.closeMask();
      //applyedit调用
      _store.siteLayer
        .applyEdits(editParams)
        .then(function (editsResult) {
          if (editsResult.updateFeatureResults.length > 0) {
            console.log("-------编辑成功-------");
            //编辑成功后，刷新弹出框内容
            _store.selectedFeature.popupTemplate = _store.popupTemplate;
            _store.mapView.popup.open({
              features: [_store.selectedFeature]
            });
          }
        })
        .catch(function (error) {
          console.log("error = ", error.message);
        });
    }
  },
  mounted () { },
  computed: {
    getDialogShowFlag () {
      return this.$store.state.mapStore.dialogShowFlag;
    }
  },
  watch: {
    getDialogShowFlag (newVal, oldVal) {
      //切换弹出框可见性
      this.showMask = newVal;
      if (newVal) {//显示时，赋初值
        let _store = this.$store.state.mapStore;
        this.sizeForm.STNM = _store.selectedFeature.attributes.STNM;
        this.sizeForm.STCD = _store.selectedFeature.attributes.STCD;
        this.sizeForm.FRGRD = _store.selectedFeature.attributes.FRGRD;
        this.sizeForm.STTP = _store.selectedFeature.attributes.STTP;
        this.sizeForm.ATCUNIT = _store.selectedFeature.attributes.ATCUNIT;
        this.sizeForm.ADMAUTH = _store.selectedFeature.attributes.ADMAUTH;
        this.sizeForm.STLC = _store.selectedFeature.attributes.STLC;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  .dialog-container {
    width: 300px;
    height: 400px;
    background: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;
    position: relative;
    .content {
      color: #797979;
      line-height: 26px;
      padding: 0 20px;
      box-sizing: border-box;
      & > .attpanel {
        padding-top: 20px;
        padding-left: 0px !important;
      }
    }
    .inp {
      margin: 10px 0 0 20px;
      width: 200px;
      height: 40px;
      padding-left: 4px;
      border-radius: 4px;
      border: none;
      background: #efefef;
      outline: none;
      &:focus {
        border: 1px solid #509ee3;
      }
    }
    .btns {
      width: 100%;
      height: 60px;
      // line-height: 60px;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: right;
      padding: 0 16px;
      box-sizing: border-box;
      & > div {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        padding: 0 14px;
        color: #ffffff;
        background: #f1f1f1;
        border-radius: 8px;
        margin-right: 12px;
        cursor: pointer;
      }
    }
  }
}
</style>