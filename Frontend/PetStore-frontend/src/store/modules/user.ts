import {
  Module, VuexModule, Mutation, Action
} from 'vuex-module-decorators'
import EAddressTypes from '@/enum/EAddressTypes'
import { IAddress } from '@/struct/IUserSetting'
import addressApi from '../../api/address'

@Module({
  namespaced: true
})
export default class User extends VuexModule {
  addresses: object[] = []
  billingAddresses: object[] = []
  shippingAddresses: object[] = []
  addressLock = false

  @Mutation
  LOCK_ADDRESS_REQ() {
    this.addressLock = true
  }
  @Mutation
  RELEASE_ADDRESS_REQ() {
    this.addressLock = false
  }
  @Mutation
  SET_ADDRESSES(addresses: IAddress[]) {
    this.addresses = addresses
    this.billingAddresses = addresses.filter((address) => [
      EAddressTypes.BILLING, EAddressTypes.BOTH
    ].includes(address.addressType))
    this.shippingAddresses = addresses.filter((address) => [
      EAddressTypes.SHIPPING, EAddressTypes.BOTH
    ].includes(address.addressType))
  }

  @Action
  async getUserAddresses() {
    if (!this.addressLock) {
      this.context.commit('LOCK_ADDRESS_REQ')
      const res = await addressApi.getAddress()
      this.context.commit('RELEASE_ADDRESS_REQ')
      this.context.commit('SET_ADDRESSES', res.data.data)
    }
  }
}
