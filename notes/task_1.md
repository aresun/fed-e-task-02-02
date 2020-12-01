### 演变过程

- 文件引入
  - 污染全局作用域
  - 命名冲突
  - 无法管理模块依赖关系
- 在模块对象上定义命名空间
- IIFE
  - 私有变量
  - 可以引入依赖

### 模块化规范

- CommonJS
  - 一个模块一个文件
  - 每个模块都有单独的作用域
  - `module.exports` 导出成员
  - `require` 函数导入模块
  - 同步模式加载模块
- AMD
  - 相对复杂
  - JS 文件请求频繁

---

### 模块化标准规范 ES Modules

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>ES Module - 模块的特性</title>
  </head>
  <body>
    <!-- 通过给 script 添加 type = module 的属性，就可以以 ES Module 的标准执行其中的 JS 代码了 -->
    <script type="module">
      console.log("this is es module");
    </script>

    <!-- 1. ESM 自动采用严格模式，忽略 'use strict' -->
    <script type="module">
      console.log(this);
    </script>

    <!-- 2. 每个 ES Module 都是运行在单独的私有作用域中 -->
    <script type="module">
      var foo = 100;
      console.log(foo);
    </script>
    <script type="module">
      console.log(foo);
    </script>

    <!-- 3. ESM 是通过 CORS 的方式请求外部 JS 模块的 -->
    <!-- <script type="module" src="https://unpkg.com/jquery@3.4.1/dist/jquery.min.js"></script> -->

    <!-- 4. ESM 的 script 标签会延迟执行脚本 -->
    <script defer src="demo.js"></script>
    <p>需要显示的内容</p>
  </body>
</html>
```

---

- 导出

```javascript
export var name = "foo module";

export function hello() {
  console.log("hello");
}

export class Person {}
```

```javascript
var name = "foo module";

function hello() {
  console.log("hello");
}

class Person {}

export { name as theName, hello, Person };
export default name;
```

---

- 导入

```javascript
// import default
import { default as fooName } from "./module.js";
import theName from "./module.js";

import { name, hello as theHello, Person } from "./module.js";
```

```javascript
var name = "jack";
var age = 18;

// export a object
export default { name, age };
```

- `import` is to import reference, and read only

```javascript
// module A change value of a variable

// in module B use reference
// after value changed in module A,
// later access in module B will see the value change by use reference
```

```javascript
// import { name } from './module'
import { name } from "./module.js";
console.log(name);

// import { lowercase } from './utils'
import { lowercase } from "./utils/index.js";
console.log(lowercase("HHH"));

// import { name } from 'module.js'
import { name } from "./module.js";
import { name } from "/04-import/module.js";
import { name } from "http://localhost:3000/04-import/module.js";
console.log(name);

// load only
import {} from "./module.js";
import "./module.js";

// import all
import * as mod from "./module.js";
console.log(mod);

// import is concrete
// var modulePath = './module.js'
// import { name } from modulePath
// console.log(name)

// import is top level
// if (true) {
//   import { name } from './module.js'
// }

// load module dynamically
import("./module.js").then(function (module) {
  console.log(module);
});

// import default
import { name, age, default as abc } from "./module.js";
import abc, { name, age } from "./module.js";
console.log(name, age, abc);
```

- export import

```javascript
//
import { Button } from "./button.js";
import { Avatar } from "./avatar.js";

export { Button, Avatar };

//
export { default as Button } from "./button.js";
export { Avatar } from "./avatar.js";
```

### ES Module in node

```javascript
// 第一，将文件的扩展名由 .js 改为 .mjs；
// 第二，启动时需要额外添加 `--experimental-modules` 参数；

import { foo, bar } from "./module.mjs";

console.log(foo, bar);

// 此时我们也可以通过 esm 加载内置模块了
import fs from "fs";
fs.writeFileSync("./foo.txt", "es module working");

// 也可以直接提取模块内的成员，内置模块兼容了 ESM 的提取成员方式
import { writeFileSync } from "fs";
writeFileSync("./bar.txt", "es module working");

// 对于第三方的 NPM 模块也可以通过 esm 加载
import _ from "lodash";
_.camelCase("ES Module");

// 不支持，因为第三方模块都是导出默认成员
// import { camelCase } from 'lodash'
// console.log(camelCase('ES Module'))
```

- es module & commonjs

```javascript
// ------ common.js
// CommonJS 模块始终只会导出一个默认成员
module.exports = {
  foo: "commonjs exports value",
};
exports.foo = "commonjs exports value";

// 不能在 CommonJS 模块中通过 require 载入 ES Module
// const mod = require("./es-module.mjs");
// console.log(mod);

// ------ es-module.mjs
// ES Module 中可以导入 CommonJS 模块
import mod from "./commonjs.js";
console.log(mod);

// 不能直接提取成员，注意 import 不是解构导出对象
// import { foo } from './commonjs.js'
// console.log(foo)
```

- differences between CommonJs

```javascript
// ESM 中没有模块全局成员了

// // 加载模块函数
// console.log(require)

// // 模块对象
// console.log(module)

// // 导出对象别名
// console.log(exports)

// // 当前文件的绝对路径
// console.log(__filename)

// // 当前文件所在目录
// console.log(__dirname)

// -------------

// require, module, exports 自然是通过 import 和 export 代替

// __filename 和 __dirname 通过 import 对象的 meta 属性获取
// const currentUrl = import.meta.url
// console.log(currentUrl)

// 通过 url 模块的 fileURLToPath 方法转换为路径
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__filename);
console.log(__dirname);
```

- node 新版本

```javascript
// ------ index.js
// Node v12 之后的版本，可以通过 package.json 中添加 type 字段为 module，
// 将默认模块系统修改为 ES Module
// 此时就不需要修改文件扩展名为 .mjs 了
import { foo, bar } from "./module.js";
console.log(foo, bar);

// ------ common.cjs
// 如果需要在 type=module 的情况下继续使用 CommonJS，
// 需要将文件扩展名修改为 .cjs
const path = require("path");
console.log(path.join(__dirname, "foo"));
```

- use ES module in lower nodejs by babel-node

```javascript
// ------ index.js
// 对于早期的 Node.js 版本，可以使用 Babel 实现 ES Module 的兼容

// $ yarn add @babel/node --dev
// $ yarn add @babel/core --dev
// $ yarn add @babel/preset-env --dev

// yarn babel-node index.js
import { foo, bar } from "./module.js";
console.log(foo, bar);

// ------ .babelrc
{
  "presets": ["@babel/preset-env"], // use all babel plugins when `$ yarn babel-node index.js`

  // $ yarn add @babel/plugin-transform-modules-commonjs --dev
  "plugins": ["@babel/plugin-transform-modules-commonjs"] // only use this plugin
}
```
