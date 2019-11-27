import Vue from 'vue'
import App from './App.vue'

// 引入全局的样式文件，包含了重置样式和字体样式以及项目中需要使用的公共样式
import '@/styles/index.less'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
