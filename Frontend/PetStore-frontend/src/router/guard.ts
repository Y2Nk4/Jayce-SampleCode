import VueRouter from 'vue-router'
import Vue from 'vue'

export default (router: VueRouter) => {
  router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
      document.title = to.meta.title
    }
    const TOKEN = localStorage.getItem('USER_TOKEN')
    if (to.meta && to.meta.noAuth) {
      if (!TOKEN) {
        return next()
      }
      return router.push({
        path: '/'
      })
    }
    if (to.meta && to.meta.requireAuth) {
      if (TOKEN) {
        return next()
      }
      Vue.prototype.$dialog.message.warning('Please Login First', {
        position: 'top'
      })
      console.log('login fist', from)
      next({ name: 'auth.login',
        query: {
          toPath: to.path
        }
      })
    }
    next()
  })
}
