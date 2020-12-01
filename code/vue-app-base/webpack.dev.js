const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const dev_config = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          // "vue-style-loader",
          "css-loader",
          // "postcss-loader",
        ],
      },
    ],
  },
  devServer: {
    contentBase: "./public",
    hot: true,
    port: 8666,
    open: true,
  },
});

module.exports = dev_config;
