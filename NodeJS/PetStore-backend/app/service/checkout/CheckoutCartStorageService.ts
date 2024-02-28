import { Service } from 'egg'
import CheckoutCart from '../../lib/CheckoutCart/CheckoutCart'

export default class CheckoutCartStorageService extends Service {
  async getCheckoutCart(sessionId: string, checkoutCartId: string) {
    const serializedCart = await this.app.redis.get(`${sessionId}/CCart_${checkoutCartId}`)
    if (!serializedCart) throw new Error('Checkout Cart does not exist')
    return CheckoutCart.deserialize(serializedCart)
  }

  async saveCheckoutCart(sessionId: string, checkoutCartId: string, checkoutCart: CheckoutCart) {
    // 7 * 24 * 60 * 60 = 604800
    console.log('saved', checkoutCart.serialize())
    await this.app.redis.setex(`${sessionId}/CCart_${checkoutCartId}`, 604800, checkoutCart.serialize())
    this.ctx.session.checkoutCartId = checkoutCartId

    return Promise.resolve()
  }
}
