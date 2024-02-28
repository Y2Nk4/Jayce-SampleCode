import fetch from './fetch'

export default {
  getShippingRates(params: { checkoutCartId: string }) {
    return fetch.get('/shipping/getShippingRates', params)
  }
}
