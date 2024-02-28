import ResourceResponse from './ResourceResponse'

export default ResourceResponse((address) => {
  return {
    id: address.id,
    addressType: address.address_type,
    firstName: address.first_name,
    lastName: address.last_name,
    address1: address.address1,
    address2: address.address2,
    company: address.company,
    city: address.city,
    country: address.country,
    zipCode: address.zip_code,
    state: address.state,
    phone: address.phone,
  }
})
