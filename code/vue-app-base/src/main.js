import Vue from "vue";
import App from './App.vue'

import logHi from "./log.js";
import "./global.css";
import './style.less'

logHi();
console.log("from main 666");

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

if (module.hot) {
  module.hot.accept("./log.js", function () {
    logHi();
  });
}
