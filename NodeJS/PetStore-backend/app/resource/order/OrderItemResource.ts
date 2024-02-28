import ResourceResponse from '../ResourceResponse'
import ProductImageResource from '../ProductImageResource'
import ProductVariantResource from '../ProductVariantResource'

export default ResourceResponse(orderItem => {
  return {
    id: orderItem.id,
    amount: orderItem.amount,
    item_snapshot: orderItem.item_snapshot,
    product_id: orderItem.product_id,
    product_image: ProductImageResource(orderItem.product_image.pop()),
    variant_image: ProductImageResource(orderItem.product_image.pop()),
    variant_id: orderItem.variant_id,
    variant: ProductVariantResource(orderItem.variant),
    single_price: orderItem.single_price,
    total_price: orderItem.total_price,
  }
})
