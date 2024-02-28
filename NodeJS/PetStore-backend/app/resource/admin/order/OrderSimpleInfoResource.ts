import ResourceResponse from '../../ResourceResponse'
import OrderItemResource from './OrderItemResource'
import { IModel } from 'egg'
import PaymentDetailResource from '../payment/PaymentDetailResource'
import AddressResource from '../../AddressResource'

export default ResourceResponse((order: IModel['UserOrder']) => {
  return {
    id: order.id,
    user_id: order.user_id,
    status: order.status,
    checkout_cart_payment_id: order.checkout_cart_payment_id,
    amount: order.amount,
    paid_at: order.paid_at,
    auto_canceled_at: order.auto_canceled_at,
    user_simple_info: order.userSimpleInfo,
    created_at: order.created_at,
    updated_at: order.updated_at,
    payment: order.payment,
    detailPayment: PaymentDetailResource(order.detailPayment),
    addresses: AddressResource(order.addresses),
    items: OrderItemResource(order.items)
  }
})
