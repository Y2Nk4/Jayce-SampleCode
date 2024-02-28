import { IFetchShoppingCartParams, IAddItemToCartParams, IRemoveItemFromCartParams, IChangeItemAmountParams } from '@/struct/IShoppingCart'
import fetch from './fetch'

export default {
  getShoppingCart(params: IFetchShoppingCartParams|undefined) {
    return fetch.get('/shoppingCart/getShippingCart', params)
  },

  addToCart(params: IAddItemToCartParams|undefined) {
    return fetch.post('/shoppingCart/addToCart', params)
  },

  changeItemAmount(params: IChangeItemAmountParams|undefined) {
    return fetch.post('/shoppingCart/changeItemAmount', params)
  },

  removeFromCart(params: IRemoveItemFromCartParams|undefined) {
    return fetch.post('/shoppingCart/removeFromCart', params)
  },

  getItemsAmount() {
    return fetch.get('/shoppingCart/getItemsAmount')
  }
}
