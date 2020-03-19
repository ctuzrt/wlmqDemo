<template>
  <section>
    <el-row class="grid-bread">
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/tileMap' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="grid-content">
      <el-col :span="24">
        <el-card class="box-card"
                 shadow="hover">
          <div slot="header"
               class="clearfix">
            <i class="el-icon-document"></i>
            <span class="grid-title">个人信息</span>
            <div class="grid-tools">
              <el-button type="primary"
                         plain
                         size="mini"
                         icon="el-icon-edit">编辑</el-button>
            </div>
          </div>
          <el-row style="padding-bottom:40px;">
            <el-col :span="6">用户名：</el-col>
            <el-col :span="6">{{username}}</el-col>
            <el-col :span="6">角色：</el-col>
            <el-col :span="6">{{rolename}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">邮箱：</el-col>
            <el-col :span="6">{{email}}</el-col>
            <el-col :span="6">备注：</el-col>
            <el-col :span="6">{{description}}</el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>
<script>
export default {
  data () {
    return {
      username: "",
      rolename: "",
      email: "",
      description: ""
    };
  },
  mounted () {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.username = user.username;
      switch (user.roleid) {
        case "1":
          this.rolename = "超级管理员";
          break;
        case "2":
          this.rolename = "管理员";
          break;
        case "3":
          this.rolename = "用户";
          break;
      }

      this.email = user.email;
      this.description = user.description;
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.grid-bread {
  padding: 20px 20px;
}

.grid-content {
  padding: 0 15px 0 15px;
  font-size: 13px;
  .grid-title {
    padding-left: 10px;
  }
  .grid-tools {
    float: right;
  }
}
</style>

