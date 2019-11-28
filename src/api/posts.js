// 引入封装的axios
import axios from '@/utils/myaxios.js'

export const getPostList = (params) => {
  return axios({
    url: '/post',
    params
  })
}
