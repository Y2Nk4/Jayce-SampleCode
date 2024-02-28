import axios, { AxiosRequestConfig } from 'axios'
import qs from 'qs'
import Vue from 'vue'
import appConfig from '../config/app.config'

axios.defaults.baseURL = appConfig.fetch_base_url

axios.defaults.withCredentials = true

// 请求拦截器
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  // 发起请求前获取令牌给后端
  config.withCredentials = true
  const token = localStorage.getItem('USER_TOKEN')
  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.data.success) {
      return Promise.resolve(response)
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ response, message: response.data.error || 'service normal error' })
  },
  function (this: Vue, error) {
    const { response = {} } = error
    // console.log(response);
    if (response.status === 400) {
      let message = ''
      if (response.data.error) {
        message = response.data.error
      } else {
        message = `Oops, Looks like something went wrong (${response.status})`
      }
      Vue.prototype.$dialog.message.warning(message, {
        position: 'top'
      })
    } else if (response.status === 401) {
      Vue.prototype.$dialog.message.warning(
        response.data.error, {
          position: 'top'
        }
      )
      localStorage.removeItem('LOGIN_STATE')
      // TODOLIST:进行路由跳转
    } else if (response.status === 403) {
      let message = ''
      if (response.data.error) {
        message = response.data.error
      } else {
        message = `Oops, Drew needs to see who you are. (${response.status})`
      }

      Vue.prototype.$dialog.message.warning(message, {
        position: 'top'
      })
      localStorage.removeItem('LOGIN_STATE')
      this.$router.push('/login')
    } else if (response.status === 404) {
      let message
      if (response.data.error) {
        message = response.data.error
      } else {
        message = `Oops, Drew hide this item from the shelves. (${response.status})`
      }
      Vue.prototype.$dialog.message.warning(message, {
        position: 'top'
      })
    } else if (response.status >= 500) {
      let message
      if (response.data.error) {
        message = response.data.error
      } else {
        message = `Oops, something seems wrong with our server. (${response.status})`
      }
      Vue.prototype.$dialog.message.warning(message, {
        position: 'top'
      })
    }
    return Promise.reject(error)
  }
)

// 封装请求
export default {
  get(url: string, params: object|undefined = {}) {
    return axios({
      method: 'get',
      url,
      params,
      paramsSerializer: (query) => qs.stringify(query)
    })
  },
  post(url: string, params: object|undefined = {}) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(params)
    })
  },
  put(url: string, params: object|undefined = {}) {
    return axios({
      method: 'put',
      url,
      data: qs.stringify(params)
    })
  },
  delete(url: string, params: object|undefined = {}) {
    return axios({
      method: 'delete',
      url,
      params
    })
  },
}
