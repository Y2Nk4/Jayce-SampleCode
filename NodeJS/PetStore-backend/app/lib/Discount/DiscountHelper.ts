import EDiscountTypes from '../../enum/EDiscountTypes'
import PercentageDiscount from './PercentageDiscount'
import FixAmountDiscount from './FixAmountDiscount'
import { DiscountOptions } from './DiscountContract'
import { IModel } from 'egg'
import EModifierScope from '../../enum/EModifierScope'
import NullDiscount from './NullDiscount'

export default class DiscountHelper {
  static buildDiscountFromObject(options: DiscountOptions) {
    switch (options.discountType) {
      case EDiscountTypes.Percentage:
        return new PercentageDiscount(options)
      case EDiscountTypes.FixAmount:
        return new FixAmountDiscount(options)
      default:
        return new NullDiscount(options)
    }
  }

  static fromModel(model: IModel['Discount']) {
    let applicableVariants = [],
      applicableProducts = []

    if (model.apply_to === EModifierScope.EveryCartItem) {
      applicableVariants = model.variants.map(item => item.id) || []
      applicableProducts = model.products.map(item => item.id) || []
    }

    const options: DiscountOptions = {
      discountId: model.id,
      discountName: model.code,
      discountValue: model.value,
      modifierScope: model.apply_to,
      discountType: model.discount_type,
      applicableVariants,
      applicableProducts,
    }

    return this.buildDiscountFromObject(options)
  }
}
