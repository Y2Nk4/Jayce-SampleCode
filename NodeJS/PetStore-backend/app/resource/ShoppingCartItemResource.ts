import ResourceResponse from './ResourceResponse'
import ProductResource from './ProductResource'
import ProductVariantResource from './ProductVariantResource'
import ProductImageResource from './ProductImageResource'

export default ResourceResponse(shoppingCartItem => {
  const variant = Object.assign({}, shoppingCartItem.variant.toJSON(), {
    product: null,
  })

  return {
    id: shoppingCartItem.id,
    product_id: shoppingCartItem.product_id,
    variant_id: shoppingCartItem.variant_id,
    sku_name: shoppingCartItem.sku_name,
    amount: shoppingCartItem.amount,
    product_image: shoppingCartItem.product_image ? ProductImageResource(shoppingCartItem.product_image.pop()) : '',
    variant_image: shoppingCartItem.variant_image ? ProductImageResource(shoppingCartItem.variant_image.pop()) : '',
    is_saved_for_later: shoppingCartItem.is_saved_for_later,
    product: ProductResource(shoppingCartItem.product),
    variant: ProductVariantResource(variant),
  }
})
