import {
  Module, VuexModule, MutationAction, Action, Mutation
} from 'vuex-module-decorators'
import { ISimpleOrder, IOrderDetail } from '@/struct/IOrder'
import orderApi from '../../api/order'

@Module({
  namespaced: true
})
export default class Order extends VuexModule {
  orderList:ISimpleOrder[] = []
  orderDetail = {}
  addresses: object[] = []

  @Mutation
  async SET_ORDER_DETAIL(orderDetail: IOrderDetail) {
    this.orderDetail = orderDetail
  }
  @Mutation
  async SET_ORDER_ADDRESSES(addresses: object[]) {
    this.addresses = addresses
  }

  @MutationAction({ mutate: ['orderList'], rawError: true })
  async getOrderList() {
    const res = await orderApi.getOrderList()
    return {
      orderList: res.data.data
    }
  }

  @Action({ rawError: true })
  async getOrderDetail(orderId: number) {
    const res = await orderApi.getOrderDetail({ orderId })

    this.context.commit('SET_ORDER_DETAIL', res.data.data)

    return res.data.data
  }

  @Action({ rawError: true })
  async getOrderAddresses(orderId: number) {
    const res = await orderApi.getOrderAddresses({ orderId })

    this.context.commit('SET_ORDER_ADDRESSES', res.data.data)

    return res.data.data
  }
}
