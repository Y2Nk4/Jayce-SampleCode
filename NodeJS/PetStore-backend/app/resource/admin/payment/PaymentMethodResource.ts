import ResourceResponse from '../../ResourceResponse'
import { IModel } from 'egg'

export default ResourceResponse((method: IModel['PaymentMethod']) => {
  return {
    id: method.id,
    name: method.name,
    display_name: method.display_name,
    description: method.description,
    enabled: method.enabled,
    payment_logo_url: method.payment_logo_url,
    transaction_fee: method.transaction_fee,
    discount_rate: method.discount_rate,
    payment_gateway: method.payment_gateway,
    created_at: method.created_at,
    updated_at: method.updated_at,
    deleted_at: method.deleted_at,
  }
})
