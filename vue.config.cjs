/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const tsNameof = require("ts-nameof");
var merge = require("webpack-merge");

module.exports = {
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
      path.resolve(__dirname, "../node_modules/typeorm/typeorm-model-shim")
    );
  },
};
