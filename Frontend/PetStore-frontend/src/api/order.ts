import { IGetOrderDetailParams } from '@/struct/IOrder'
import fetch from './fetch'

export default {
  async getOrderList() {
    return fetch.get('/user/order/orderList')
  },

  async getOrderDetail(params: IGetOrderDetailParams) {
    return fetch.get('/user/order/orderDetail', params)
  },

  async getOrderAddresses(params: IGetOrderDetailParams) {
    return fetch.get('/user/order/getOrderAddresses', params)
  }
}
