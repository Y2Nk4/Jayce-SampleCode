import {
  Module, VuexModule, Mutation
} from 'vuex-module-decorators'

@Module({
  namespaced: true
})
export default class Common extends VuexModule {
  isShowLoadingOverlay = false

  @Mutation
  SHOW_LOADING_OVERLAY() {
    this.isShowLoadingOverlay = true
  }

  @Mutation
  HIDE_LOADING_OVERLAY() {
    this.isShowLoadingOverlay = false
  }
}
