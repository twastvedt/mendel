/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        typeorm: path.resolve(
          __dirname,
          "../node_modules/typeorm/typeorm-model-shim"
        ),
      },
    },
    devServer: {
      historyApiFallback: true,
    },
  },
  chainWebpack: (config) => {
    config.plugin("fork-ts-checker").tap((args) => {
      args[0].typescript.configFile = "./tsconfig.frontend.json";
      return args;
    });
  },
};
