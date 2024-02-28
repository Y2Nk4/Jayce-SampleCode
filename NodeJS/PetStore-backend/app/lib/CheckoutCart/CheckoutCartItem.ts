import { IModel } from 'egg'
import DiscountContract from '../Discount/DiscountContract'
import * as flatted from 'flatted'

export interface IDiscountDetail{
  appliedAmount: number;
  subtotal: number;
  discount: DiscountContract;
}
interface ITotalPrice{
  discountDetails: IDiscountDetail[];
  totalPrice: number;
}

export default class CheckoutCartItem {
  protected purchaseAmount: number
  protected originalPrice: number

  readonly cartItemId: string|number;
  // variant info
  readonly productName: string
  readonly variantName: string
  readonly variantId: number
  readonly productId: number
  // variant price
  readonly itemPrice: number
  readonly itemNormalPrice: number

  constructor(variantId: number, productId: number, productName: string, variantName: string,
    itemPrice: number, itemNormalPrice: number, amount: number, cartItemId: string|number|null = null) {
    this.variantId = variantId
    this.productId = productId
    this.productName = productName
    this.variantName = variantName
    this.itemPrice = itemPrice
    if (cartItemId) this.cartItemId = cartItemId
    this.itemNormalPrice = itemNormalPrice

    this.purchaseAmount = amount
    this.originalPrice = itemPrice * amount
  }

  static fromModel(dbProductVariant: IModel['ProductVariant'], amount: number, cartItemId: string|number|null = null) {
    return new CheckoutCartItem(
      dbProductVariant.id,
      dbProductVariant.product.id,
      dbProductVariant.product.title,
      dbProductVariant.sku_name,
      dbProductVariant.price,
      dbProductVariant.normal_price,
      amount,
      cartItemId
    )
  }

  updateAmount(amount: number) {
    this.purchaseAmount = amount
    this.originalPrice = this.itemPrice * amount
  }

  getAmount() {
    return this.purchaseAmount
  }

  getOriginalPrice() {
    return this.originalPrice
  }

  getTotalPrice(discounts: DiscountContract[]): ITotalPrice {
    let singlePrice = this.itemPrice
    let discountDetails:IDiscountDetail[] = []
    this.getApplicableDiscounts(discounts).forEach((discount) => {
      let priceAfterDiscount = discount.getPrice(singlePrice)
      discountDetails.push({
        appliedAmount: (singlePrice - priceAfterDiscount) * this.purchaseAmount,
        discount,
        subtotal: priceAfterDiscount
      })
      singlePrice = priceAfterDiscount
    })

    return {
      discountDetails,
      totalPrice: singlePrice * this.purchaseAmount
    }
  }

  getApplicableDiscounts(discounts: DiscountContract[]) {
    return discounts.filter(discount => {
      return discount.getApplicableVariants().includes(this.variantId) ||
        discount.getApplicableProducts().includes(this.productId)
    })
  }

  serialize() {
    return flatted.stringify({
      variantId: this.variantId,
      productId: this.productId,
      productName: this.productName,
      variantName: this.variantName,
      itemPrice: this.itemPrice,
      itemNormalPrice: this.itemNormalPrice,
      amount: this.purchaseAmount,
      cartItemId: this.cartItemId
    })
  }

  static deserialize(data: string) {
    const struct = flatted.parse(data)
    return new CheckoutCartItem(
      struct.variantId,
      struct.productId,
      struct.productName,
      struct.variantName,
      struct.itemPrice,
      struct.itemNormalPrice,
      struct.amount,
      struct.cartItemId)
  }
}
