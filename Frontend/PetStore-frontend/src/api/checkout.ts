import {
  ICheckoutParams, IAddDiscountParams, IRemoveDiscountParams,
  IInitPaymentParams, ISelectShippingAddressParams, ICancelPaymentParams,
  IFetchPaymentResultParams, ISubmitPaymentParams
} from '@/struct/ICheckout'

import { IUpdateShippingAddressParams, IUpdateBillingAddressParams } from '@/struct/IUserSetting'

import fetch from './fetch'

export default {
  initCheckout(params: ICheckoutParams) {
    return fetch.post('/checkout/initCheckout', params)
  },

  getCheckoutCartDetailSubtotal(params: { checkoutCartId: string }) {
    return fetch.get('/checkout/getCheckoutCartDetailSubtotal', params)
  },

  addDiscount(params: IAddDiscountParams) {
    return fetch.post('/checkout/addDiscount', params)
  },

  removeDiscount(params: IRemoveDiscountParams) {
    return fetch.post('/checkout/removeDiscount', params)
  },

  updateShippingAddress(params: IUpdateShippingAddressParams) {
    return fetch.post('/checkout/updateShippingAddress', params)
  },

  updateBillingAddress(params: IUpdateBillingAddressParams) {
    console.log(params)
    return fetch.post('/checkout/updateBillingAddress', params)
  },

  selectShippingRate(params: ISelectShippingAddressParams) {
    return fetch.post('/checkout/selectShippingRate', params)
  },

  initPayment(params: IInitPaymentParams) {
    return fetch.post('/checkout/initPayment', params)
  },

  cancelPayment(params: ICancelPaymentParams) {
    return fetch.post('/checkout/cancelPayment', params)
  },

  fetchPaymentResult(params: IFetchPaymentResultParams) {
    return fetch.post('/checkout/fetchPaymentResult', params)
  },

  submitPayment(params: ISubmitPaymentParams) {
    return fetch.post('/checkout/submitPayment', params)
  }
}
