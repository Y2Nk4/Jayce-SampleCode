import { Service, IModel } from 'egg'

export default class PaymentGateway extends Service{
  async cancelCheckoutPayment(checkoutPayment: IModel['CheckoutCartPayment']) {
    const { app } = this
    switch (checkoutPayment.payment_gateway) {
      case app.enum.ePaymentGatewaySymbol.STRIPE:
        let result = await app.stripe().paymentIntents.cancel(checkoutPayment.payment_transaction_id)
        if (result.status === 'canceled') {
          return Promise.resolve()
        } else {
          // 假如已经支付
        }
    }
  }
}
