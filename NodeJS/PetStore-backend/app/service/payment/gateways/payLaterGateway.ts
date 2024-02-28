import GatewayContract, { ICreatePaymentOptions } from './gatewayContract'
import { ICreatePaymentResult } from './gatewayContract'
import { Transaction } from 'sequelize'
import { IModel } from 'egg'

export default class PayLaterGateway extends GatewayContract {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createPayment(_amount: number, _currency: string, _options: ICreatePaymentOptions): Promise<ICreatePaymentResult> {
    return {
      paymentTransactionId: null,
      paymentSessionId: null,
      orderId: undefined,
      gatewayId: this.app.enum.ePaymentGatewaySymbol.PayLater,
      skipPaymentStep: false
    }
  }

  async submitPayment(payment: IModel['CheckoutCartPayment'], _paymentProfile: IModel['CheckoutCartPaymentGatewayDetail'], _paymentMethod: IModel['PaymentMethod'], transaction: Transaction) {
    const result = await this.service.order.order.confirmPaymentProc(
      payment, transaction,
      this.app.enum.ePaymentStatusCode.Submitted,
      this.app.enum.eUserOrderStatus.OrderInitialized)

    return result
  }
}
