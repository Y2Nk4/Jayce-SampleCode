import ResourceResponse from './ResourceResponse'

export default ResourceResponse(shippingRate => {
  return {
    id: shippingRate.id,
    name: shippingRate.name,
    rate: shippingRate.rate,
  }
})
