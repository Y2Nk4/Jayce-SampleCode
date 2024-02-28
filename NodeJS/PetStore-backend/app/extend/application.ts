import stripe from 'stripe'
import { Application } from 'egg'

const STRIPE = Symbol('Application#stripe')

export default {
  stripe(this: Application) {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    if (!this[STRIPE]) {
      // 实际情况肯定更复杂
      this[STRIPE] = new stripe(this.config.stripe.skKey, {
        apiVersion: '2020-08-27',
      })
    }
    return this[STRIPE]
  },
}
