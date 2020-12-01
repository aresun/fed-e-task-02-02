const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: "./src/main.js",
  mode: "none",
  target: "web",
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "output"),
    // publicPath: "dist/", // base of asset path after bundle
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_module/,
      },
      {
        test: /\.js$/,
        use: "eslint-loader",
        exclude: /node_module/,
        enforce: "pre",
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.png$/,
        // use: [
        //   "file-loader",
        //   // "url-loader",
        // ],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024, // unit Byte
              esModule: false, // commonjs module
            },
          },
        ],
      },
      // 普通的 `.scss` 文件和 `*.vue` 文件中的
      // `<style lang="scss">` 块都应用它
      // {
      //   test: /\.scss$/,
      //   use: ["vue-style-loader", "css-loader", "sass-loader"],
      // },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "home work",
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      BASE_URL: "'./'", // 改变 index.html 的插值
    }),
    new VueLoaderPlugin(),
  ],
};
