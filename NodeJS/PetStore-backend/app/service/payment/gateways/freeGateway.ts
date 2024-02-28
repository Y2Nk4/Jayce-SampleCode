import GatewayContract, { ICreatePaymentOptions } from './gatewayContract'
import { ICreatePaymentResult } from './gatewayContract'

export default class FreeGateway extends GatewayContract {

  async createPayment(_amount: number, _currency: string, options: ICreatePaymentOptions): Promise<ICreatePaymentResult> {
    const result = await this.service.order.order.confirmPaymentProc(
      options.payment,
      options.transaction,
      this.app.enum.ePaymentStatusCode.Paid,
      this.app.enum.eUserOrderStatus.PaymentConfirmed)

    return {
      paymentTransactionId: null,
      paymentSessionId: null,
      orderId: result.order ? result.order.id : undefined,
      gatewayId: this.app.enum.ePaymentGatewaySymbol.Free,
      skipPaymentStep: true
    }
  }

  async submitPayment() {
    return { order: null }
  }
}
