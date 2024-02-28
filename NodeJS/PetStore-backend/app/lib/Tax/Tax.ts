import CartItemModifier from '../CheckoutCart/CartItemModifier'
import { IModel } from 'egg'
import EModifierScope from '../../enum/EModifierScope'
import * as flatted from 'flatted'

export default class Tax extends CartItemModifier {
  readonly taxName: string
  protected taxValue: number
  protected taxId: number
  public modifierScope = EModifierScope.FinalPrice
  static readonly specialID = {
    PaymentFee: -1,
    '-1': 'PaymentFee'
  }

  constructor(taxId: number, taxName: string, taxValue: number) {
    super()
    this.taxName = taxName
    this.taxId = taxId
    this.taxValue = taxValue
  }

  computeTax(price: number) {
    return Math.ceil(price * (this.taxValue / 1000000))
  }

  serialize() {
    return flatted.stringify({
      taxId: this.taxId,
      taxName: this.taxName,
      taxValue: this.taxValue,
    })
  }

  static deserialize(data: string) {
    const struct = flatted.parse(data)
    return new Tax(struct.taxId, struct.taxName, struct.taxValue)
  }

  static fromModel(model: IModel['PostalCode']): Tax[] {
    if (model.state_rate + model.city_rate +
      model.county_rate + model.special_rate === model.combined_rate
    ) {
      const rates: Tax[] = []
      if (model.state_rate) {
        rates.push(new Tax(model.id, `${model.state_abbr} State Rate`, model.state_rate))
      }
      if (model.city_rate) {
        rates.push(new Tax(model.id, `${model.state_abbr} City Rate`, model.city_rate))
      }
      if (model.county_rate) {
        rates.push(new Tax(model.id, `${model.state_abbr} County Rate`, model.county_rate))
      }
      if (model.special_rate) {
        rates.push(new Tax(model.id, `${model.state_abbr} Special Rate`, model.special_rate))
      }
      return rates
    }
    return [
      new Tax(model.id, `${model.state_abbr} Combined Rate`, model.combined_rate),
    ]

  }
}
