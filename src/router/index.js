// 1.引入vue
import Vue from 'vue'
// 2.引入vue-router
import VueRouter from 'vue-router'

// 引入路由所映射的组件
import Login from '@/views/login.vue'
import Index from '@/views/index.vue'
import Wel from '@/views/welcomePage.vue'
import PostList from '@/views/postList.vue'
import AddPost from '@/views/addPost.vue'

// 3. use
Vue.use(VueRouter)
// 4.创建路由对象
let router = new VueRouter({
  // 5.进行路由配置
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'Index' }
    },
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Index',
      path: '/index',
      component: Index,
      // 添加重定向，让其默认展示欢迎界面
      redirect: { name: 'Wel' },
      // 添加嵌套路由
      children: [
        {
          name: 'Wel',
          path: 'wel',
          component: Wel
        },
        {
          name: 'PostList',
          path: 'postList',
          component: PostList
        },
        {
          name: 'AddPost',
          path: 'addPost',
          component: AddPost
        }
      ]
    }
  ]
})

// 添加导航守卫
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    let token = localStorage.getItem('heima_back_39_token')
    if (token) {
      next()
    } else {
      next({ path: '/login' })
    }
  } else {
    next()
  }
})

// 6.暴露
export default router
