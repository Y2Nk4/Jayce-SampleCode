import Vue from 'vue'
import VuetifyDialog from 'vuetify-dialog'
import { Icon } from 'ant-design-vue'
import { config as vuexModuleConfig } from 'vuex-module-decorators'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import routerGuard from './router/guard'
import './plugins/validator'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import './assets/css/common/styles.less'

vuexModuleConfig.rawError = true

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})
Vue.component('validation-observer', ValidationObserver)
Vue.component('validation-provider', ValidationProvider)

Vue.config.productionTip = false

routerGuard(router)

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_2678345_vku0b2hwmbl.js',
})
Vue.component('my-icon', IconFont)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  async mounted() {
    if (localStorage.getItem('USER_TOKEN')) {
      await this.$store.dispatch('auth/getUserInfo')
    }
  }
}).$mount('#app')
