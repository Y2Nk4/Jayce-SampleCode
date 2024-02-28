import ResourceResponse from '../../ResourceResponse'
import { IModel } from 'egg'
import VariantResource from '../product/VariantResource'

export default ResourceResponse((item: IModel['CheckoutCartItem']) => {
  return {
    id: item.id,
    user_id: item.user_id,
    checkout_cart_payment_id: item.checkout_cart_payment_id,
    amount: item.amount,
    total_price: item.total_price,
    single_price: item.single_price,
    variant: VariantResource(item.variant),
  }
})
