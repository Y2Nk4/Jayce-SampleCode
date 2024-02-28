import {
  Module, VuexModule, Mutation, Action, MutationAction
} from 'vuex-module-decorators'
import { IFetchShoppingCartParams, IAddItemToCartParams, IRemoveItemFromCartParams, IShoppingCartItem, IChangeItemAmountParams } from '@/struct/IShoppingCart'
import shoppingCartApi from '../../api/shoppingCart'

@Module({
  namespaced: true
})
export default class Auth extends VuexModule {
  shoppingCartItems: IShoppingCartItem[] = []
  shoppingCartItemsAmount = 0

  @Mutation
  SET_SHOPPING_CART(shoppingCartItems: IShoppingCartItem[]): void {
    this.shoppingCartItems = shoppingCartItems
    this.shoppingCartItemsAmount = shoppingCartItems.length
  }

  @Action({ commit: 'SET_SHOPPING_CART', rawError: true })
  async getShoppingCart(params: IFetchShoppingCartParams) {
    const res = await shoppingCartApi.getShoppingCart(params)
    return res.data.data
  }
  @Action({ rawError: true })
  async addToCart(params: IAddItemToCartParams) {
    const res = await shoppingCartApi.addToCart(params)
    return res.data
  }
  @Action({ rawError: true })
  async removeFromCart(params: IRemoveItemFromCartParams) {
    const res = await shoppingCartApi.removeFromCart(params)
    return res.data
  }
  @Action({ rawError: true })
  async changeItemAmount(params: IChangeItemAmountParams) {
    const res = await shoppingCartApi.changeItemAmount(params)
    return res.data
  }
  @MutationAction({ mutate: ['shoppingCartItemsAmount'], rawError: true })
  async getItemsAmount() {
    const res = await shoppingCartApi.getItemsAmount()
    return {
      shoppingCartItemsAmount: res.data.data
    }
  }
}
