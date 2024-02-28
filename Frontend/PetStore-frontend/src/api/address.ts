import { IGetAddressParams, IAddress } from '@/struct/IUserSetting'
import fetch from './fetch'

export default {
  addAddress(address: IAddress, addressType: number) {
    return fetch.put('/user/edit/address', {
      ...address,
      addressType
    })
  },
  getAddress(addressType?: number|undefined) {
    return fetch.get('/user/addresses', {
      addressType
    })
  },
  editAddress(addressId: number, newAddress: IAddress) {
    return fetch.post('/user/edit/address', {
      addressId,
      ...newAddress
    })
  },
  verifyAddress(address: IAddress) {
    return fetch.post('/address/validate', {
      ...address
    })
  },
  deleteAddress(addressId: number) {
    return fetch.delete('/user/edit/address', {
      addressId
    })
  },
}
