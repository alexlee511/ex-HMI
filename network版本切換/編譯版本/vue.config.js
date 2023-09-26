module.exports = {
  lintOnSave: true,
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        network: "@/network",
        views: "@/views",
        layout: "@/layout",
        solution: "@/solution"
      }
    }
  },
  productionSourceMap : false,
  publicPath: "./",
  devServer: {
        https: true
    }
};
