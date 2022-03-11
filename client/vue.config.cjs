/* eslint-disable @typescript-eslint/no-var-requires */

const tsNameof = require("ts-nameof");
var { merge } = require("webpack-merge");

module.exports = {
  lintOnSave: "warning",
  configureWebpack: {
    devtool: "source-map",
  },
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    config.module
      .rule("ts")
      .use("ts-loader")
      .tap((options) =>
        merge(options, {
          getCustomTransformers: () => ({ before: [tsNameof] }),
        })
      );

    config.devServer.historyApiFallback(true);

    config.resolve.alias.set(
      "typeorm",
      require.resolve("typeorm/typeorm-model-shim")
    );
  },
};
