import ResourceResponse from '../../ResourceResponse'
import { IModel } from 'egg'
import UserSimpleInfoResource from '../user/UserSimpleInfoResource'
import CheckoutCartItemResource from './CheckoutCartItemResource'

export default ResourceResponse((payment: IModel['CheckoutCartPayment']) => {
  return {
    cart_id: payment.cart_id,
    gateway_status: payment.gateway_status,
    grand_total: payment.grand_total,
    id: payment.id,
    item_total: payment.item_total,
    payment_amount: payment.payment_amount,
    payment_gateway: payment.payment_gateway,
    payment_gateway_detail_id: payment.payment_gateway_detail_id,
    payment_session_id: payment.payment_session_id,
    session_id: payment.session_id,
    shipping_rate: payment.shipping_rate,
    status: payment.status,
    tax_total: payment.tax_total,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    user_id: payment.user_id,
    items: CheckoutCartItemResource(payment.items),
    userSimpleInfo: UserSimpleInfoResource(payment.userSimpleInfo)
  }
})
