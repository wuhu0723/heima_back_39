import Vue from 'vue'
import App from './App.vue'

// 引入路由模块
import router from '@/router/index.js'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入全局的样式文件，包含了重置样式和字体样式以及项目中需要使用的公共样式
import '@/styles/index.less'
// 让Vue实例上能够挂载element-ui的所有组件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router, // 注入路由
  render: h => h(App)
}).$mount('#app')
