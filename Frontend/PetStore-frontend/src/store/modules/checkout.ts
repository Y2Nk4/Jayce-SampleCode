import {
  Module, VuexModule, Action, Mutation
} from 'vuex-module-decorators'
import {
  ICheckoutItem, INotAvailableVariants, ICheckoutPaymentResponse_payment
} from '@/struct/ICheckout'
import { IAddress } from '@/struct/IUserSetting'
import EPaymentStatusCode from '@/enum/EPaymentStatusCode'
import { IShippingRate } from '@/struct/IShippingRate'
import checkoutApi from '../../api/checkout'
import shippingApi from '../../api/shipping'

@Module({
  namespaced: true
})
export default class Checkout extends VuexModule {
  checkoutItems: ICheckoutItem[] = []
  notAvailableVariants: INotAvailableVariants[] = []
  checkoutCartId = localStorage.getItem('checkoutCartId') || ''
  checkoutStep = localStorage.getItem('checkoutStep')
    ? Math.min(Number(localStorage.getItem('checkoutStep')), 2) : 0
  checkoutCartSubtotal: object = {
    subtotalBeforeTax: {
      itemDetailSubtotal: [],
      discounts: []
    }
  }
  checkoutPayments: {paymentId?: number} = {}
  paymentGatewayResult: object = {}
  paymentResult: object = {}
  selectedPaymentSummary: { id: number } | undefined = undefined
  shippingRates: IShippingRate[] = []

  @Mutation
  SET_SHIPPING_RATES(shippingRates: IShippingRate[]) {
    this.shippingRates = shippingRates
  }
  @Mutation
  SET_CHECKOUT_ITEMS(items: ICheckoutItem[]) {
    this.checkoutItems = items
  }
  @Mutation
  SET_CHECKOUT_CART_ID(cartId: string) {
    this.checkoutCartId = cartId
    localStorage.setItem('checkoutCartId', cartId)
  }
  @Mutation
  SET_CHECKOUT_STEP(step: number) {
    this.checkoutStep = step
    localStorage.setItem('checkoutStep', step.toString())
  }
  @Mutation
  SET_NOT_AVAILABLE_ITEMS(notAvailableVariants: INotAvailableVariants[]) {
    this.notAvailableVariants = notAvailableVariants
  }
  @Mutation
  SET_CHECKOUT_CART_SUBTOTAL(subtotal: object) {
    this.checkoutCartSubtotal = subtotal
  }
  @Mutation
  SET_CHECKOUT_PAYMENTS(payments: ICheckoutPaymentResponse_payment) {
    this.checkoutPayments = payments
  }
  @Mutation
  SET_PAYMENT_RESULT(paymentResult: object) {
    this.paymentResult = paymentResult
  }
  @Mutation
  UPDATE_PAYMENT_SUMMARY(selectedPaymentSummary: { id: number }) {
    this.selectedPaymentSummary = selectedPaymentSummary
  }
  @Mutation
  SET_PAYMENT_GATEWAY_RESULT(paymentGatewayResult: object) {
    this.paymentGatewayResult = paymentGatewayResult
  }

  @Action({ rawError: true })
  async initCheckout(items: ICheckoutItem[]) {
    const res = await checkoutApi.initCheckout({ items })
    const info = res.data.data

    console.log(info.notAvailableVariants)

    this.context.commit('SET_CHECKOUT_CART_ID', info.checkoutCartId)
    this.context.commit('SET_NOT_AVAILABLE_ITEMS', info.notAvailableVariants)
    this.context.commit('SET_CHECKOUT_STEP', 0)

    return info
  }

  @Action({ rawError: true })
  async getCheckoutCartSubtotal(checkoutCartId: string|undefined) {
    if (checkoutCartId) {
      this.context.commit('SET_CHECKOUT_CART_ID', checkoutCartId)
    }
    const res = await checkoutApi.getCheckoutCartDetailSubtotal({
      checkoutCartId: this.checkoutCartId
    })
    const cartInfo = res.data.data
    this.context.commit('SET_CHECKOUT_CART_SUBTOTAL', cartInfo)
    if (!cartInfo.allowCheckout) {
      this.context.commit('SET_CHECKOUT_STEP', -1)
    }

    return res.data.data
  }

  @Action({ rawError: true })
  async updateShippingAddress(address: IAddress) {
    const res = await checkoutApi.updateShippingAddress({
      checkoutCartId: this.checkoutCartId,
      ...address
    })

    return res.data.data
  }

  @Action({ rawError: true })
  async getShippingRate() {
    const res = await shippingApi.getShippingRates({
      checkoutCartId: this.checkoutCartId
    })
    this.context.commit('SET_SHIPPING_RATES', res.data.data)
  }

  @Action({ rawError: true })
  async updateBillingAddress(payload: {differentBillingAddress: boolean, address: IAddress|undefined}) {
    const address = payload.address ? payload.address : {}
    const res = await checkoutApi.updateBillingAddress({
      checkoutCartId: this.checkoutCartId,
      differentBillingAddress: payload.differentBillingAddress ? 1 : 0,
      ...address
    })

    return res.data.data
  }

  @Action({ rawError: true })
  async addDiscount(discountCode: string) {
    const res = await checkoutApi.addDiscount({
      checkoutCartId: this.checkoutCartId,
      couponCode: discountCode
    })

    return res.data.data
  }

  @Action({ rawError: true })
  async removeDiscount(discountCodes: string[]) {
    const res = await checkoutApi.removeDiscount({
      checkoutCartId: this.checkoutCartId,
      couponCodeIds: discountCodes.join(',')
    })

    return res.data.data
  }

  @Action({ rawError: true })
  async selectShippingRate(shippingRateId: number) {
    const res = await checkoutApi.selectShippingRate({
      checkoutCartId: this.checkoutCartId,
      shippingRateId
    })

    return res.data.data
  }

  @Action({ rawError: true })
  async initPayment() {
    const res = await checkoutApi.initPayment({
      checkoutCartId: this.checkoutCartId
    })

    this.context.commit('SET_CHECKOUT_PAYMENTS', res.data.data.payment)
    this.context.commit('SET_CHECKOUT_CART_SUBTOTAL', res.data.data.cart)

    return res.data.data
  }

  @Action({ rawError: true })
  async cancelPayment() {
    if (this.checkoutPayments && this.checkoutPayments.paymentId) {
      const res = await checkoutApi.cancelPayment({
        checkoutCartId: this.checkoutCartId,
        paymentId: this.checkoutPayments.paymentId
      })

      this.context.commit('SET_CHECKOUT_PAYMENTS', undefined)

      return res.data.data
    }
    return Promise.resolve()
  }

  @Action({ rawError: true })
  async fetchPaymentResult() {
    if (this.checkoutPayments && this.checkoutPayments.paymentId) {
      const res = await checkoutApi.fetchPaymentResult({
        paymentId: this.checkoutPayments.paymentId
      })
      this.context.commit('SET_PAYMENT_RESULT', res.data.data)
      return res.data.data
    }
    return Promise.resolve()
  }

  @Action({ rawError: true })
  wrappedFetchResult() {
    let counter = 0

    const fetchResult = () => new Promise((resolve) => {
      this.context.dispatch('fetchPaymentResult')
        // eslint-disable-next-line consistent-return
        .then((res) => {
          counter += 1
          if ((res.status === EPaymentStatusCode.NotPaid || res.status === EPaymentStatusCode.Submitted) && counter <= 3) {
            setTimeout(() => fetchResult().then((data) => {
              resolve(data)
            }), 800)
          } else {
            return resolve(res)
          }
        })
    })

    return fetchResult()
  }

  @Action({ rawError: true })
  async submitPayment(paymentDetailId: number) {
    if (this.checkoutPayments && this.checkoutPayments.paymentId) {
      const res = await checkoutApi.submitPayment({
        checkoutCartId: this.checkoutCartId,
        paymentId: this.checkoutPayments.paymentId,
        paymentDetailId
      })
      return res.data.data
    }
    return Promise.resolve()
  }
}
