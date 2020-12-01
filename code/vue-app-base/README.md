# vue-app-base

1. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
2. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
3. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
4. 尽可能的使用上所有你了解到的功能和特性

## steps

- `npm i`
- `npm i webpack webpack-cli --dev`
- 修改 `webpack.config.js`
- `npm i css-loader style-loader -D`
- `npm i file-loader -D`
- `npm i url-loader -D`
- `npm i babel-loader @babel/core @babel/preset-env -S`
    - `npm i @vue/cli-plugin-babel -D`
        - babel 打包报错
- `npm i clean-webpack-plugin -D`
- `npm i html-webpack-plugin -D`
- `npm i copy-webpack-plugin -D`
- `npm i webpack-dev-server -D`
- `npm i webpack-merge -D`
    - 用来拆分 development, production, common 配置文件
- `npm install -D vue-loader vue-template-compiler vue-style-loader`
- `npm i less less-loader -D`
- `npm i optimize-css-assets-webpack-plugin -D`
- `npm install eslint eslint-loader -D`