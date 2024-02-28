import {
  Module, VuexModule, Action
} from 'vuex-module-decorators'
import searchApi from '../../api/search'

@Module({
  namespaced: true
})
export default class Auth extends VuexModule {
  @Action({ rawError: true })
  async searchProducts(keyword: string) {
    const res = await searchApi.searchProducts(keyword)
    return res.data.data
  }
}
