import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 120000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
let flag = true
// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 0) {
      if (res.code === 2) {
        if(flag){
          Message({
            message: '你已被退出登录，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
          store.dispatch('user/logout').then(() => {
            location.reload()
          }) 
          flag = false    
        }
      } else {
        if (res.msg == '无法获取菜单!') {
          return res
        } else {
          Message({
            message: res.msg || 'Error',
            type: 'error',
            duration: 5 * 1000
          })
        }
      }
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
