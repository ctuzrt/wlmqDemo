/* * @Author: liwei@esrichina.com.cn * @Date: 2019-06-23 15:41:12 * @Last
Modified by: liwei@esrichina.com.cn * @Last Modified time: 2019-06-27 13:53:10
*/
<template>
  <div class="login">
    <el-card class="box-card login-container">
      <div slot="header"
           class="clearfix">
        <span class="title">欢迎登陆</span>
      </div>
      <div>
        <el-form ref="form"
                 :model="form"
                 :rules="rules">
          <el-form-item prop="username">
            <el-input type="text"
                      size="small"
                      v-model="form.username"
                      auto-complete="off"
                      placeholder="用户名">
              <el-button size="mini"
                         slot="prepend"
                         icon="el-icon-user-solid"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password"
                      size="small"
                      v-model="form.password"
                      auto-complete="off"
                      placeholder="密码">
              <el-button size="mini"
                         slot="prepend"
                         icon="el-icon-lock"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-bottom:0px">
            <el-button type="primary"
                       size="small"
                       @click="submitForm()"
                       style="width:100%"
                       :loading="logining">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
const config = window.config;

export default {
  data () {
    return {
      config: config,
      form: {
        username: "admin",
        password: "admin"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      logining: false
    };
  },
  methods: {
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.logining = true;
          const loginParams = {
            username: this.form.username,
            password: this.form.password
          };
          this.axios
            .get(window.mapConfig.OprService.getUser, loginParams)
            .then(response => {
              this.logining = false;
              const user = {
                username: "admin",
                roleid: "1",
                email: "liwei@esrichina.com.cn",
                description: "易智瑞（中国）信息技术有限公司"
              };
              sessionStorage.setItem("user", JSON.stringify(user));
              this.$router.push("/vueAJS");
            })
            .catch(response => {
              this.logining = false;
              console.log(response);
            });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.el-card__header {
  padding: 15px 20px !important;
}
</style>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/loginbg.png");
  background-size: cover;
  background-position: 50%;
  position: relative;
  .login-container {
    position: absolute;
    right: 160px;
    top: 50%;
    -webkit-transform: translateY(-60%);
    transform: translateY(-60%);
    width: 300px;
    .title {
      font-size: 14px;
      font-weight: 700;
      color: #17233d;
    }
  }
}
</style>
