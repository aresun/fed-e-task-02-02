# module bundler

## reason for existence

- ES module 兼容性
- 模块文件过多，请求频繁
- 其他文件也需要模块化打包

## webpack

### basic usage

- `$ yarn add webpack webpack-cli --dev`
- `$ yarn webpack`
  - // `src/index.js` <- default entry
  - // `dest/main.js` < - default output
  - // `webpack.config.js` <- default config file

### configuration file

```javascript
// /webpack.config.js
const path = require("path");

module.exports = {
  // 这个属性有三种取值，分别是 production、development 和 none。
  // 1. 生产模式下，Webpack 会自动优化打包结果；
  // 2. 开发模式下，Webpack 会自动优化打包速度，添加一些调试过程中的辅助；
  // 3. None 模式下，Webpack 就是运行最原始的打包，不做任何额外处理；
  mode: "development",

  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    // must be a absolute path of the directory
    // here: /output; not /dest/ anymore
    path: path.join(__dirname, "output"),
  },
};
```

### asset loader

> for loading any kind of assets;

> use `import` to import assets to js module<br>
> ex: `import './main.css` in .js file

```javascript
const path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/main.css",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /.css$/,
        // $ yran add css-loader --dev
        // $ yran add style-loader --dev // use <style> tag to put result of css loader to html
        // order of loader: from right to left
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

- `file-loader`

  - in js file
    - `import icon from './icon.png'`
  - `webpack.config.js`

```javascript
// ..
module.exports = {
  // ..
  output: {
    // ..
    publicPath: "dist/", // base of asset path after bundle
  },
  module: {
    rules: [
      // ..
      {
        // use file loader
        test: /.png$/,
        use: "file-loader",
      },
    ],
  },
};
```

- DataURLs
- use url to represent a file content,like base64
  - `url-loader`
  - `$ yard add url-loader --dev` // file-loader required

```javascript
// ..
module.exports = {
  // ..
  module: {
    rules: [
      // ..
      {
        test: /.png$/,
        use: {
          loader: "url-loader",
          options: {
            // transform small file to data url, reduce http request
            limit: 10 * 1024, // 10 KB
          },
        },
      },
    ],
  },
};
```

- process es2015
  - `$ yarn add babel-loader @babelcore @babel/preset-env --dev`

```javascript
const path = require("path");

module.exports = {
  // ..
  module: {
    rules: [
      // ..
      {
        test: /.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

### webpack supported module

- ESmodule
- require.default
- AMD deine require
- @import url in .css
- src in html

```javascript
// footer.html
// <footer>
//   <!-- <img src="better.png" alt="better" width="256"> -->
//   <a href="better.png">download png</a>
// </footer>

// main.js
import footerHtml from "./footer.html";
document.write(footerHtml);

// webpack.config.js
// ..
module.exports = {
  // ..
  module: {
    rules: [
      // ..
      {
        // $ yarn add html-loader --dev
        test: /.html$/,
        use: {
          loader: "html-loader",
          // only process img:src
          // so use a:href to process <a>
          options: {
            attrs: ["img:src", "a:href"],
          },
        },
      },
    ],
  },
};
```

### customize webpack loader

```javascript
// :: main.js // to reference about.md asset
import about from "./about.md";
console.log(about);

// :: /markdown-loader.js // loader definition file
// $ yarn add marked
const marked = require("marked");

module.exports = (source) => {
  // console.log(source)
  const html = marked(source);
  // return html
  // return `module.exports = "${html}"`
  // return `export default ${JSON.stringify(html)}`

  // return `js code string`
  // 返回 html 字符串交给下一个 loader(html-loader) 处理
  return html;
};

// :: webpack.config.js
// ..
module.exports = {
  // ..
  module: {
    rules: [
      {
        test: /.md$/,
        // use path to set loader
        // use html-loader to process html string from markdown-loader
        use: ["html-loader", "./markdown-loader"],
      },
    ],
  },
};
```

### webpack plugins

> to enhance webpack automation</br>

- common plugins
  - clear directory automaticlly:
    - `$ yarn add clean-webpack-plugin --dev`
    - add plugin in `webpack.config.js`

```javascript
// ..
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // ..
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: "dist/",
  },
  plugins: [new CleanWebpackPlugin()],
};
```

- generate html
  - solve path reference
  - `$ yarn add html-webpack-plugin --dev`

```javascript
// ./src/index.html // template for html-webpack-plugin
/* <body>
  <div class="container">
    <!-- lodash template syntax -->
    <h1><%= htmlWebpackPlugin.options.title %></h1>
  </div>
</body> */

// webpack.config.js
// ..
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    // here: generated html is in dist now, so remove publicPath
    // publicPath: 'dist/'
  },
  module: {
    // ..
  },
  plugins: [
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      // config for html tag
      title: "Webpack Plugin Sample",
      meta: {
        viewport: "width=device-width",
      },
      // generate from this template html
      template: "./src/index.html",
    }),
    // 用于生成 about.html
    new HtmlWebpackPlugin({
      filename: "about.html",
    }),
  ],
};
```

- copy-webpack-plugin
  - to copy file to output directly
  - `$ yarn add copy-webpack-plugin --dev`

```javascript
// ..
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // ..
  plugins: [
    // ..
    new CopyWebpackPlugin([
      // transfer files under public directory to output path
      // 'public/**'
      "public",
    ]),
  ],
};
```

#### plugin theory

- 通过在生命周期的钩子中挂载函数实现扩展
- hook
  - 必须是一个函数 或 包含 apply 方法的对象

```javascript
// ..

class MyPlugin {
  // define apply method
  // - use compiler to registry hook function
  apply(compiler) {
    console.log("MyPlugin 启动");

    const plugin_name = `MyPlugin`;
    // emit hook, registry by tap()
    compiler.hooks.emit.tap(plugin_name, (compilation) => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name) // file name
        // console.log(compilation.assets[name].source()) // file content

        // process js file
        if (name.endsWith(".js")) {
          const contents = compilation.assets[name].source();
          const withoutComments = contents.replace(/\/\*\*+\*\//g, "");

          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          };
        }
      }
    });
  }
}

module.exports = {
  // ..
  plugins: [
    // ..
    new MyPlugin(),
  ],
};
```

### watch work mode

- `$ yarn webpack --watch` // bundle automatically when files of src changed(bundle only)
- `browser-sync dist --files "**/*"` // use browser sync to reload page automatically (not good enough)

- webpack dev server
  - auto-bundle & auto-refresh page
  - `$ yarn add webpack-dev-server --dev`
  - `$ yarn webpack-dev-server --open`

```javascript
// webpack.config.js
// ..
module.exports = {
  // ..
  // here to config webpack-dev-server
  devServer: {
    // add other static assets path
    // when in development mode, no need to copy files under public/
    contentBase: "./public",
    proxy: {
      // url start with `/api`
      "/api": {
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: "https://api.github.com",
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: {
          "^/api": "",
        },
        // 不能使用 localhost:8080 作为请求 GitHub 的主机名
        changeOrigin: true,
      },
    },
  },
  // ..
  plugins: [
    // ..
    // 开发阶段最好不要使用这个插件
    // new CopyWebpackPlugin(['public'])
  ],
};

// main.js
// fetch proxy api example
const ul = document.createElement("ul");
document.body.append(ul);

// 跨域请求，虽然 GitHub 支持 CORS，但是不是每个服务端都应该支持。
// fetch('https://api.github.com/users') // pathRewrite removed `/api`
fetch("/api/users") // http://localhost:8080/api/users
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.login;
      ul.append(li);
    });
  });
```

### source map

- locate error
- usage

  - add `//# sourceMappingURL=jquery-3.4.1.min.map` to reference source map in processed js file
  - open browser Source, can see source code of that file now

- name analyse

  - eval - 是否使用 eval 执行模块代码
  - cheap - souce map 是否包含行信息
  - module - 是否能得到 loader 处理之前的源代码
  - inline -
  - hidden - generated but no reference
  - nosources - provide line information but no source code in source tap

- cheap-module-eval-source-map - for development
- none - for production

### HMR

- preserve status of operation after auto-reload pages by change source code
- `$ yarn webpack-dev-server --open`

```javascript
const webpack = require("webpack");
// ..
module.exports = {
  //..
  devServer: {
    hot: true, // 热替换失败(热替换处理逻辑内报错)，刷新页面
    // hotOnly: true // 模块出错时, 只使用 HMR，不会 fallback 到 live reloading
  },
  //..
  plugins: [
    // ..
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```

- 某个 **js** 模块的热替换逻辑
  - 替换逻辑与模块功能相关, 每个替换都需要相应的特殊处理

```javascript
// src/editor.js
import "./editor.css";

export default () => {
  const editorElement = document.createElement("div");

  editorElement.contentEditable = true;
  editorElement.className = "editor";
  editorElement.id = "editor";

  console.log("editor init completed");

  return editorElement;
};

// src/main.js
import createEditor from "./editor";
import background from "./better.png";
import "./global.css";

const editor = createEditor();
document.body.appendChild(editor);

const img = new Image();
img.src = background;
document.body.appendChild(img);

// ============ 以下用于处理 HMR，与业务代码无关 ============

// console.log(createEditor)
// hot is from HMR
if (module.hot) {
  // stored status before hot module reload
  let lastEditor = editor;
  const module_path_editor = "./editor";
  const module_path_img = "./better.png";

  // registry hmr handler
  module.hot.accept(module_path_editor, () => {
    // console.log('editor 模块更新了，需要这里手动处理热替换逻辑')
    // console.log(createEditor)

    const value = lastEditor.innerHTML;
    document.body.removeChild(lastEditor);

    const newEditor = createEditor();
    newEditor.innerHTML = value;
    document.body.appendChild(newEditor);

    // used closure
    lastEditor = newEditor;
  });

  module.hot.accept(module_path_img, () => {
    img.src = background;
    console.log(background);
  });
}
```

### 依据运行环境优化 config

- 方式 0, 依据 cli 参数

```javascript
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const config = {
    mode: "development",
    devtool: "cheap-eval-module-source-map",
    // ..
    devServer: {
      hot: true,
      contentBase: "public",
    },
    module: {
      // ..
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack Tutorial",
        template: "./src/index.html",
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };

  // $ yarn webpack --env production
  if (env === "production") {
    config.mode = "production";
    config.devtool = false;
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin(["public"]),
    ];
  }

  return config;
};
```

- 方式 1
  - `webpack.common.js`
  - `webpack.dev.js`
  - `webpack.pro.js`

```javascript
// yarn add webpack-merge --dev
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  plugins: [new CleanWebpackPlugin(), new CopyWebpackPlugin(["public"])],
});
```

- `$ yarn webpack --config webpack.pro.js`

### DefinePlugin

- 为代码注入全局成员, production mode 默认启用
  - `process.env.NODE_ENV`
  - useage
    - `console.log(API_BASE_URL)`

```javascript
const webpack = require("webpack");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      // 值要求的是一个代码片段
      // 因为打包后 key 的位置被替换成去掉引号之后的代码
      API_BASE_URL: JSON.stringify("https://api.example.com"),
    }),
  ],
};
```

### tree shaking

- 未引用代码 dead-code
- production 模式自动启用

```javascript
module.exports = {
  // ..
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              // 如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效
              // ['@babel/preset-env', { modules: 'commonjs' }]
              // ['@babel/preset-env', { modules: false }]
              // 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
              ["@babel/preset-env", { modules: "auto" }],
            ],
          },
        },
      },
    ],
  },
  optimization: {
    // 开启 side effect 功能
    sideEffects: true,
    // package.json 中保留有副作用的 文件
    //   "sideEffects": [
    // "./src/extend.js",
    // "*.css"
    // ]

    // 模块只导出被使用的成员
    usedExports: true,
    // 尽可能合并每一个模块到一个函数中  // 提升运行效率，减少代码体积
    // concatenateModules: true,
    // 压缩输出结果 // removed unused code
    // minimize: true
  },
};
```

### 拆分代码

- 多入口打包
  - 适于多页应用

```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: {
    // entry name: path
    index: "./src/index.js",
    album: "./src/album.js",
  },
  output: {
    // place holder, entry_name.bundle.js
    filename: "[name].bundle.js",
  },
  optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      // 这样每个页面都会共用同一 bundle
      chunks: "all",
    },
  },
  module: {
    // ..
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Multi Entry",
      template: "./src/index.html",
      filename: "index.html",
      // inject entry_name bundle result to html
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      title: "Multi Entry",
      template: "./src/album.html",
      filename: "album.html",
      chunks: ["album"],
    }),
  ],
};
```

- 动态导入

```javascript
// static import:
// import posts from './posts/posts'
// import album from './album/album'

const render = () => {
  const hash = window.location.hash || "#posts";

  const mainElement = document.querySelector(".main");

  mainElement.innerHTML = "";

  if (hash === "#posts") {
    // mainElement.appendChild(posts())
    // optional: magic comment
    // make 2 modules into the same bundle file components.bundle.js
    import(/* webpackChunkName: 'components' */ "./posts/posts").then(
      ({ default: posts }) => {
        mainElement.appendChild(posts());
      }
    );
  } else if (hash === "#album") {
    // mainElement.appendChild(album())
    import(/* webpackChunkName: 'components' */ "./album/album").then(
      ({ default: album }) => {
        mainElement.appendChild(album());
      }
    );
  }
};

render();

window.addEventListener("hashchange", render);
```

### miniCssExtractPlugin

- 将所有 css 打包到 1 个 css bundle 中 (>=150kb 适用)

```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// $ yarn add mini-css-extract-plugin --dev
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩 css 文件
// $ yarn add optimize-css-assets-webpack-plugin --dev
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// $ yarn add terser-webpack-plugin --dev
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "none",
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
  },
  optimization: {
    minimizer: [
      // enabled when: $ yarn webpack --mode production
      // no default opimization anymore

      // so add js compresser
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 将样式通过 style 标签注入
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Dynamic import",
      template: "./src/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
};
```

### hash cache

```javascript
module.exports = {
  output: {
    filename: "[name]-[hash].bundle.js",
    // 某个 chunk(ex: dynamic import()) 改变，hash 才变，mian 可能被动改变
    filename: "[name]-[chunkhash].bundle.js",
    // 文件更新, 才改变 hash, 某个 单独的文件 与 引入此文件的文件 的 hash 会变
    filename: "[name]-[contenthash:8].bundle.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]-[hash].bundle.js",
      filename: "[name]-[chunkhash].bundle.js",
      // ..
    }),
  ],
};
```
