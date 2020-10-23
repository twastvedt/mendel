/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const tsNameof = require("ts-nameof");

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
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                getCustomTransformers: () => ({ before: [tsNameof] }),
                transpileOnly: true,
                appendTsSuffixTo: ["\\.vue$"],
              },
            },
          ],
        },
      ],
    },
  },
};
