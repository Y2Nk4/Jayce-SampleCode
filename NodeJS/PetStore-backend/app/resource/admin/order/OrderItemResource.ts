import ResourceResponse from '../../ResourceResponse'
import ProductImageResource from '../../ProductImageResource'
import { IModel } from 'egg'
import ProductVariantResource from '../../ProductVariantResource'

export default ResourceResponse((orderItem: IModel['UserOrderItem']) => {
  return {
    id: orderItem.id,
    item_snapshot: orderItem.item_snapshot,
    amount: orderItem.amount,
    total_price: orderItem.total_price,
    single_price: orderItem.single_price,
    variant: ProductVariantResource(orderItem.variant),
    product_image: ProductImageResource(orderItem.product_image).pop(),
    variant_image: ProductImageResource(orderItem.variant_image).pop()
  }
})
