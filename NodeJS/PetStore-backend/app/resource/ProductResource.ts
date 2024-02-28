import ResourceResponse from './ResourceResponse'
import ProductVariantResource from './ProductVariantResource'
import ProductImageResource from './ProductImageResource'

export default ResourceResponse(product => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    type: product.type ? product.type : undefined,
    variants: ProductVariantResource(product.variants, false),
    images: ProductImageResource(product.images),
    product_image: product.product_image ? ProductImageResource(product.product_image.pop()) : undefined
  }
})
