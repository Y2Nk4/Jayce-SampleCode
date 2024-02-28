import DiscountContract from './DiscountContract'
import EDiscountTypes from '../../enum/EDiscountTypes'
import EModifierTypes from '../../enum/EModifierTypes'

export default class FixAmountDiscount extends DiscountContract {
  public modifierType = EModifierTypes.SaleModifier
  public discountType = EDiscountTypes.FixAmount

  getPrice(price: number) {
    let finalPrice = price - this.discountValue
    if (finalPrice < 0) finalPrice = 0
    return finalPrice
  }
}
