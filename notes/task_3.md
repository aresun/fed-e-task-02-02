# rollup

## install

- `$ yarn add rollup`

## usage

- `yarn rollup ./path/entry_file.js --format iife --file dist/bundle.js`
- 默认 tree shaking

## configuration file

- `rollup.config.js`

```javascript
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
};
```

- `$ yarn rollup --config rollup.config.js`

## plugins

- 唯一的扩展方式
- `$ yarn add rollup-plugin-json --dev`

```javascript
// :: index.js: comsume json file
import { name, version } from "../package.json";

// :: rollup config file; add pulgin
import json from "rollup-plugin-json";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  // add plugin to support import json file
  plugins: [json()],
};
```

## 加载 npm module

- `$yarn add rollup-plugin-node-resolve --dev`

```javascript
// :: index.js: to comsume npm module
// 导入模块成员
import _ from "lodash-es"; // rollup 默认使用 ES module 版本
import { log } from "./logger";
import messages from "./messages";
import { name, version } from "../package.json";

// 使用模块成员
const msg = messages.hi;

log(msg);

log(name);
log(version);
log(_.camelCase("hello world"));

// :: config: to support npm import
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  // to support import npm module
  plugins: [json(), resolve()],
};
```

## 加载 common js module

- `$ yran add rollup-plugin-commonjs --dev`

```javascript
// :: index.js
// use import to use module exported by commonjs

// :: rollup.config.js
// ..
import commonjs from "rollup-plugin-commonjs";

export default {
  // ..
  plugins: [json(), resolve(), commonjs()],
};
```

## code splitting

- `$ yarn rollup --config --format amd`

```javascript
// :: index.js
import("./logger").then(({ log }) => {
  log("code splitting~");
});

// :: config
export default {
  input: "src/index.js",
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife'
    dir: "dist", // code splitting output
    format: "amd",
  },
};
```

## multiple entries

```javascript
// :: index.html
<!-- AMD 标准格式的输出 bundle 不能直接引用 -->
<!-- <script src="foo.js"></script> -->
<!-- 需要 Require.js 这样的库 -->
<script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="foo.js"></script>
```

```javascript
// :: rollup.config.js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: "src/index.js",
    bar: "src/album.js",
  },
  output: {
    dir: "dist",
    format: "amd",
  },
};
```
