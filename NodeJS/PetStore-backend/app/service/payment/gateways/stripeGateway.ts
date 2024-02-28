import GatewayContract, { ICreatePaymentOptions } from './gatewayContract'
import { ICreatePaymentResult } from './gatewayContract'

export default class StripeGateway extends GatewayContract {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createPayment(amount: number, currency = 'usd', _options: ICreatePaymentOptions): Promise<ICreatePaymentResult> {
    const stripeResult = await this.app.stripe().paymentIntents.create({
      amount,
      currency,
    })

    return {
      paymentTransactionId: stripeResult.id,
      paymentSessionId: stripeResult.client_secret,
      clientSecret: stripeResult.client_secret,
      paymentRawData: stripeResult,
      gatewayId: this.app.enum.ePaymentGatewaySymbol.STRIPE,
      skipPaymentStep: false
    }
  }

  async submitPayment() {
    return { order: null }
  }
}
