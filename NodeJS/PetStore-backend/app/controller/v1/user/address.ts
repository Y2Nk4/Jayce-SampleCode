import { Controller } from 'egg'
import EAddressTypes from '../../../enum/EAddressTypes'
import AddressResource from '../../../resource/AddressResource'
import * as _ from 'lodash'

export default class AddressController extends Controller {
  async addAddress() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
      address1: { type: 'string', required: true },
      city: { type: 'string', required: true },
      // country: { type: 'string', required: true },
      zipCode: { type: 'string', required: true },
      state: { type: 'string', required: true },
      phone: { type: 'string', required: true },
      addressType: {
        type: 'enum',
        enum: [ EAddressTypes.SHIPPING, EAddressTypes.BILLING ],
        required: true,
        transform(value) {
          return Number(value)
        },
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const loggedInUser = ctx.state.user

    if (await app.model.UserAddress.count({
      where: {
        user_id: loggedInUser.id,
        address_type: ctx.request.body.addressType,
      },
    }) >= 20) {
      return ctx.error('Addresses amount has exceeded the limit of 20', 200)
    }

    await app.model.UserAddress.create({
      user_id: loggedInUser.id,
      address_type: ctx.request.body.addressType,
      first_name: ctx.request.body.firstName,
      last_name: ctx.request.body.lastName,
      address1: ctx.request.body.address1,
      address2: ctx.request.body.address2,
      company: ctx.request.body.company,
      city: ctx.request.body.city,
      country: 'US',
      zip_code: ctx.request.body.zipCode,
      state: ctx.request.body.state,
      phone: ctx.request.body.phone,
    })

    return ctx.success('Successfully added Address')
  }

  async editAddress() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      addressId: {
        type: 'integer', required: true,
        transform(value) {
          return Number(value)
        },
      },

      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
      address1: { type: 'string', required: true },
      city: { type: 'string', required: true },
      country: { type: 'string', required: true },
      zipCode: { type: 'string', required: true },
      state: { type: 'string', required: true },
      phone: { type: 'string', required: true },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const loggedInUser = ctx.state.user

    const address = await app.model.UserAddress.findOne({
      where: {
        user_id: loggedInUser.id,
        id: ctx.request.body.addressId,
      },
    })

    if (!address) return ctx.error('Address Not Found', 404)

    await address.update({
      user_id: loggedInUser.id,
      first_name: ctx.request.body.firstName,
      last_name: ctx.request.body.lastName,
      address1: ctx.request.body.address1,
      address2: ctx.request.body.address2,
      company: ctx.request.body.company,
      city: ctx.request.body.city,
      country: ctx.request.body.country,
      zip_code: ctx.request.body.zipCode,
      state: ctx.request.body.state,
      phone: ctx.request.body.phone,
    })

    return ctx.success('Updated Successfully')
  }

  async getUserAddresses() {
    const { ctx } = this
    const loggedInUser = ctx.state.user
    const filter: any = {}
    if (ctx.request.query.addressType) {
      filter.address_type = ctx.request.query.addressType
    }
    const addresses = await loggedInUser.getAddresses({
      where: filter
    })

    return ctx.success(AddressResource(addresses))
  }

  async deleteAddress() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      addressId: { type: 'integer', required: true, transform: val => Number(val) },
    }, ctx.request.query, 'rule')
    if (!valid) return

    const result = await app.model.UserAddress.destroy({
      where: {
        user_id: ctx.state.user.id,
        id: ctx.request.query.addressId
      }
    })
    console.log(result)

    return ctx.success()
  }

  async validateAddress() {
    const { ctx, service } = this

    const valid = await ctx.validate({
      address1: { type: 'string', required: true },
      city: { type: 'string', required: true },
      country: { type: 'string', required: true },
      zipCode: { type: 'string', required: true },
      state: { type: 'string', required: true },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const address = _.pick(ctx.request.body, [
      'address1', 'address2', 'city', 'zipCode', 'state'
    ])
    const validateResult = await service.usps.usps.validateAddress(address)

    return ctx.success(validateResult)
  }
}
