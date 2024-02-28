import DiscountContract from './DiscountContract'
import EDiscountTypes from '../../enum/EDiscountTypes'
import EModifierTypes from '../../enum/EModifierTypes'
import EModifierScope from '../../enum/EModifierScope'

export default class NullDiscount extends DiscountContract {
  readonly modifierType = EModifierTypes.SaleModifier
  readonly discountType = EDiscountTypes.FixAmount
  readonly modifierScope = EModifierScope.FinalPrice

  getPrice(price: number) {
    return price
  }
}
