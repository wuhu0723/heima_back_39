// 1.引入vue
import Vue from 'vue'
// 2.引入vue-router
import VueRouter from 'vue-router'

// 引入路由所映射的组件
import Login from '@/views/login.vue'

// 3. use
Vue.use(VueRouter)
// 4.创建路由对象
let router = new VueRouter({
  // 5.进行路由配置
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login
    }
  ]
})

// 6.暴露
export default router
