import { Controller } from 'egg'

export default class ShippingController extends Controller {
  async getShippingRates() {
    const { app, ctx } = this

    const rates = await app.model.ShippingRate.findAll()

    return ctx.success(app.resource.shippingRateResource(rates))
  }
}
