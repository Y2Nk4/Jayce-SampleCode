import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import shoppingCart from './modules/shoppingCart'
import product from './modules/product'
import checkout from './modules/checkout'
import common from './modules/common'
import order from './modules/order'
import store from './modules/store'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth, shoppingCart, product, checkout, common, order, store, user
  },
})
