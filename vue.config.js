module.exports = {
  publicPath: "/",
  outputDir: "dist",
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    host: "localhost",
    port: 8080,
    https: false,
    hotOnly: false,
    hot: true, // 开启热更新
	//mcp测试2
    proxy: "",
    // {
    //     "/api": {
    //         target: "http://localhost:8080",
    //         changeOrigin: true,
    //         ws: false, //值为false防止控制台报错★★★★★★★★
    //         pathRewrite: {
    //             //▼或者后台接口统一加一个前缀如api，然后这里不写 '^/' 写 '^/api'。
    //             "^/api": "/api"
    //         }
    //     }
    // },
    before: app => { }
  }
};
