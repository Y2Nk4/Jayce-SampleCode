import ResourceResponse from '../../ResourceResponse'
import { IModel } from 'egg'
import ProductVariantResource from '../../ProductVariantResource'
import ProductImageResource from '../../ProductImageResource'

export default ResourceResponse((product: IModel['Product']) => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    status: product.status,
    type: product.type ? product.type : undefined,
    variants: ProductVariantResource(product.variants, false),
    images: ProductImageResource(product.images),
    created_at: product.created_at,
    updated_at: product.updated_at,
    product_image: product.product_image ? ProductImageResource(product.product_image.pop()) : undefined
  }
})
