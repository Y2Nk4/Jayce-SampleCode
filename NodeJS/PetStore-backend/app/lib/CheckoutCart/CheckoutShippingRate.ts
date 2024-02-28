import * as flatted from 'flatted'
import { IModel } from 'egg'

export default class CheckoutShippingRate {
  id: number
  name: string
  rate: number

  constructor(id: number, name: string, rate: number) {
    this.id = id
    this.name = name
    this.rate = rate
  }

  serialize() {
    return flatted.stringify({
      id: this.id,
      name: this.name,
      rate: this.rate,
    })
  }

  static deserialize(data: string) {
    const info = flatted.parse(data)
    return new CheckoutShippingRate(info.id, info.name, info.rate)
  }

  static fromModel(model: IModel['ShippingRate']) {
    return new CheckoutShippingRate(model.id, model.name, model.rate)
  }
}
