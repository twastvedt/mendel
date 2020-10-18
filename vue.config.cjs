// eslint-disable-next-line @typescript-eslint/no-var-requires
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
      watchOptions: {
        poll: true,
      },
    },
  },
};
