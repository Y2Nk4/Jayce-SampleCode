import { ILoginForm, IRegisterForm } from '@/struct/IAuth'
import fetch from './fetch'

export default {
  // 用户登录
  login(params: ILoginForm) {
    return fetch.post('/auth/login', params)
  },
  // 用户注册
  register(params: IRegisterForm) {
    return fetch.post('/auth/register', params)
  },
  checkIfLoggedIn(params: object) {
    return fetch.post('/auth/checkIfLoggedIn', params)
  },
  getUserInfo(params: object) {
    return fetch.get('/auth/userInfo', params)
  }
}
