import ResourceResponse from './ResourceResponse'
import { IModel } from 'egg'

export default ResourceResponse((payment: IModel['CheckoutCartPayment']) => {
  return {
    cart_id: payment.cart_id,
    gateway_status: payment.gateway_status,
    grand_total: payment.grand_total,
    id: payment.id,
    item_total: payment.item_total,
    payment_amount: payment.payment_amount,
    payment_gateway: payment.payment_gateway,
    shipping_rate: payment.shipping_rate,
    status: payment.status,
    tax_total: payment.tax_total,
    user_id: payment.user_id
  }
})
