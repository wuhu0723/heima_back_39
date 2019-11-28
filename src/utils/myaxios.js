// 引入
import axios from 'axios'

// 基准路径
axios.defaults.baseURL = 'http://localhost:3000'

// 按你们的需要添加拦截器，传递token
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  console.log('我调用了你，，以此做为凭证')
  // 在发送请求之前做些什么
  let token = localStorage.getItem('heima_back_39_token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 暴露
export default axios
