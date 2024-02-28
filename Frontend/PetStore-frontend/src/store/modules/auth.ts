import {
  Module, VuexModule, Mutation, Action, MutationAction
} from 'vuex-module-decorators'
import { ILoginForm, IRegisterForm } from '@/struct/IAuth'
import authApi from '../../api/auth'

@Module({
  namespaced: true
})
export default class Auth extends VuexModule {
  userInfo: object|null = {}
  isLoggedIn = !!localStorage.getItem('USER_TOKEN')

  @Mutation
  SET_LOGIN_STATE(jwtToken: string): void {
    localStorage.setItem('USER_TOKEN', jwtToken)
  }
  @Mutation
  SET_LOGOUT_STATE(): void {
    localStorage.removeItem('USER_TOKEN')
    console.log(this)
    this.userInfo = null
  }

  @Action({ rawError: true })
  async authLogin(params: ILoginForm) {
    const res = await authApi.login(params)
    console.log(this)
    this.context.commit('SET_LOGIN_STATE', res.data.data.token)
    this.context.dispatch('getUserInfo')
  }

  @Action({ commit: 'SET_LOGIN_STATE', rawError: true })
  async authRegister(params: IRegisterForm) {
    const res = await authApi.register(params)
    return res.data.data.token
  }

  @Action({ commit: 'SET_LOGOUT_STATE', rawError: true })
  async authLogout() {
    return true
  }

  @MutationAction({ mutate: ['userInfo'] })
  async getUserInfo(params: object) {
    const res = await authApi.getUserInfo(params)
    return {
      userInfo: res.data.data
    }
  }
}
