// import CheckoutCartItem from '../CheckoutCart/CheckoutCartItem'
import CartItemModifier from '../CheckoutCart/CartItemModifier'
import * as flatted from 'flatted'

export interface DiscountOptions {
  discountId: number;
  discountName: string;
  discountValue: number;
  modifierScope: number;
  applicableVariants: number[];
  applicableProducts: number[];

  discountType?: number;

  maximumApplicableTimePerOrder?: number;
}

export default abstract class DiscountContract extends CartItemModifier {
  readonly discountId: number
  protected appliedTime = 0
  protected appliedDiscountAmount = 0
  protected applicableVariants: number[]
  protected applicableProducts: number[]
  readonly discountType: number

  static readonly specialID = {
    PaymentDiscount: -2,
    '-2': 'PaymentDiscount'
  }

  discountName: string
  readonly discountValue: number
  protected maximumApplicableTimePerOrder = 0

  constructor(options: DiscountOptions) {
    super()
    this.discountId = options.discountId
    this.discountName = options.discountName
    this.discountValue = options.discountValue
    this.modifierScope = options.modifierScope

    this.applicableVariants = options.applicableVariants
    this.applicableProducts = options.applicableProducts

    this.maximumApplicableTimePerOrder = options.maximumApplicableTimePerOrder || 0
  }


  getApplicableVariants() {
    return this.applicableVariants
  }
  getApplicableProducts() {
    return this.applicableProducts
  }

  toJSON() {
    return {
      discountId: this.discountId,
      modifierScope: this.modifierScope,
      appliedDiscountAmount: this.appliedDiscountAmount,
      discountName: this.discountName,
      modifierType: this.modifierType,
      discountValue: this.discountValue,
      discountType: this.discountType,
    }
  }


  getApplicableTimes(amount: number) {
    if (this.maximumApplicableTimePerOrder) {
      const availableTimes = this.maximumApplicableTimePerOrder - this.appliedDiscountAmount
      const time = Math.min(availableTimes, amount)
      this.appliedDiscountAmount += time
      return time
    }
    this.appliedDiscountAmount += amount
    return amount

  }

  serialize() {
    return flatted.stringify({
      discountId: this.discountId,
      discountName: this.discountName,
      discountValue: this.discountValue,
      modifierScope: this.modifierScope,
      applicableVariants: this.applicableVariants,
      applicableProducts: this.applicableProducts,
      discountType: this.discountType,
      maximumApplicableTimePerOrder: this.maximumApplicableTimePerOrder,
    })
  }

  // stat purpose
  getAppliedTime() {
    return this.appliedTime
  }
  getAppliedDiscountAmount() {
    return this.appliedDiscountAmount
  }
}
