import ResourceResponse from '../../ResourceResponse'

export default ResourceResponse((address) => {
  return {
    id: address.id,
    address_type: address.address_type,
    first_name: address.first_name,
    last_name: address.last_name,
    address1: address.address1,
    address2: address.address2,
    company: address.company,
    city: address.city,
    country: address.country,
    zip_code: address.zip_code,
    state: address.state,
    phone: address.phone,
    created_at: address.created_at,
  }
})
