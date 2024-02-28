import DiscountContract from './DiscountContract'
import EDiscountTypes from '../../enum/EDiscountTypes'
import EModifierTypes from '../../enum/EModifierTypes'

export default class PercentageDiscount extends DiscountContract {
  public modifierType = EModifierTypes.SaleModifier
  public discountType = EDiscountTypes.Percentage

  getPrice(price: number) {
    return Math.ceil(price * ((10000 - this.discountValue) / 10000))
  }
}
