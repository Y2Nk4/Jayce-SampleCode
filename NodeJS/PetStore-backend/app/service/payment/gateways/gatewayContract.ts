import { Service, IModel } from 'egg'
import { Transaction } from 'sequelize'

export interface ICreatePaymentResult{
  paymentTransactionId: string|null;
  paymentSessionId: string|null;
  paymentRawData?: object;
  clientSecret?: string;
  orderId?: number;
  gatewayId: number;
  skipPaymentStep: boolean;
}

export interface ICreatePaymentOptions{
  transaction: Transaction
  payment: IModel['CheckoutCartPayment']
}

export default abstract class GatewayContract extends Service {
  abstract async createPayment(amount: number, currency: string, _options: ICreatePaymentOptions|undefined): Promise<ICreatePaymentResult>
  abstract async submitPayment(payment: IModel['CheckoutCartPayment'], paymentProfile: IModel['CheckoutCartPaymentGatewayDetail'], paymentMethod: IModel['PaymentMethod'], transaction: Transaction): Promise<{order}>
}
