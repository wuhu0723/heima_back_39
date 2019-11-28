// 引入封装的axios
import axios from '@/utils/myaxios.js'

export const getPostList = (params) => {
  return axios({
    url: '/post',
    params
  })
}

export const getCateList = () => {
  return axios({
    url: '/category'
  })
}

export const addPost = (data) => {
  return axios({
    method: 'post',
    url: `/post`,
    data
  })
}
