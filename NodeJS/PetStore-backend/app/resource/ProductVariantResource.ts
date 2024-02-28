import ResourceResponse from './ResourceResponse'

export default ResourceResponse((productVariant, showProduct = true) => {
  return {
    id: productVariant.id,
    sku_name: productVariant.sku_name,
    barcode: productVariant.barcode,
    status: productVariant.status,
    price: productVariant.price,
    has_discount: productVariant.has_discount,
    normal_price: productVariant.normal_price,
    is_track_quantity: productVariant.is_track_quantity,
    stock_quantity: productVariant.stock_quantity,
    is_charge_tax: productVariant.is_charge_tax,
    special_tax_rate: productVariant.special_tax_rate,
    product: showProduct ? productVariant.product : undefined,
  }
})
