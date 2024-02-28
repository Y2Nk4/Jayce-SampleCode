import ResourceResponse from '../ResourceResponse'
import OrderItemResource from './OrderItemResource'
import UserPaymentDetailResource from '../UserPaymentDetailResource'

export default ResourceResponse(order => {
  return {
    id: order.id,
    amount: order.amount,
    auto_canceled_at: order.auto_canceled_at ? order.auto_canceled_at : undefined,
    // checkout_cart_payment_id: order.checkout_cart_payment_id,
    created_at: order.created_at,
    items: OrderItemResource(order.items),
    paid_at: order.paid_at,
    status: order.status,
    updated_at: order.updated_at,
    logistics: order.logistics,
    discounts: order.discounts,
    payment: UserPaymentDetailResource(order.payment),
  }
})
