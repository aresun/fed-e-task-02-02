# 简答题

## 1、`Webpack` 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 `Webpack` 打包的整个过程。

- 构建过程
  - 根据配置, 识别入口文件
  - 通过文件内的引用, 识别模块依赖关系(`ESmodule`, `CommonJS`, `AMD`, `url()`, `@import`, `src`)
  - webpack 分析每个模块, 转换代码, 编译代码(通过 `loader`, `plugins`)
  - 输出打包后的代码

## 2、`Loader` 和 `Plugin` 有哪些不同？请描述一下开发 `Loader` 和 `Plugin` 的思路。

- 不同

  - `loader` 是对所有 module 进行处理, 通过判断文件类型使用不同 `loader`, `plugin` 是在 webpack 构建整个过程中, 通过预定好的 `hooks` 触发操作
  - `loader` 通过 `webpack.config.js` 配置时有先后顺序；`plugin` 配置时引入类, 需并通过 `new` 实例化一个 `plugin` 对象

- `loader` 开发
  - 返回一个 function, function 的 参数为当前 module 的内容
  - 然后写转换逻辑, 转译内容
  - 最后返回一个 string, 这个 string 的内容是一个 js 语法代码, 代码为 js 导出 处理后的结果
- `plugin` 开发
  - 编写一个类, 类名为 `plugin` 名称
  - 在类里定义一个 `apply` 函数, 函数的 `complier` 参数可以理解为打包处理器
  - 通过 `complier.hooks` 的对应 hook 添加 `handler`
  - `handler` 里写处理逻辑, `handler` 的 `compliation` 参数为此次构建的上下文对象
    - `compilation.assets[file_name].source()` 返回文件内容
    - 编写处理逻辑, 处理文件内容等
    - 通过覆写 `compilation.assets[file_name]` 对象的 `source`, `size` 函数, 来应用转换后的文件内容