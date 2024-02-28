import ResourceResponse from '../../ResourceResponse'
import { IModel } from 'egg'

export default ResourceResponse((user: IModel['User']) => {
  return {
    id: user.id,
    username: user.username,
    phone: user.phone,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    status: user.status,
  }
})
