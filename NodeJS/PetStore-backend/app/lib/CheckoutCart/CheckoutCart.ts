import DiscountContract from '../Discount/DiscountContract'
import Tax from '../Tax/Tax'
import CheckoutCartItem, {IDiscountDetail} from './CheckoutCartItem'
import * as flatted from 'flatted'
import EModifierScope from '../../enum/EModifierScope'
import DiscountHelper from '../Discount/DiscountHelper'
import ServiceError from '../../exception/ServiceError'
import EErrorCode from '../../enum/EErrorCode'
import CheckoutShippingRate from './CheckoutShippingRate'

export interface serializedCheckoutCart {
  cartId: string;
  shippingRate: string;
  cartItems: string[];
  taxes: [];
  discounts: [];
  shippingAddress: Address;
  differentBillingAddress: boolean;
  billingAddress: Address;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  company?: string;
  city: string;
  country: string;
  zipCode: string;
  state: string;
  phone: string;
}

export interface TaxDetail {
  taxDetail: Tax;
  taxAmount: number;
}

export default class CheckoutCart {
  cartId: string
  checkoutCartItems: CheckoutCartItem[]
  discounts: DiscountContract[]
  taxes: Tax[]
  shippingAddress: Address
  differentBillingAddress: boolean
  billingAddress: Address
  shippingRate: CheckoutShippingRate

  normalPrice: number
  checkoutPrice: number

  constructor(cartId: string, checkoutCartItems: CheckoutCartItem[] = [],
    discounts: DiscountContract[] = [], taxes: Tax[] = [],
    shippingAddress: Address|null = null, differentBillingAddress = false,
    billingAddress: Address|null = null,
    shippingRate: CheckoutShippingRate|null = null
  ) {
    this.cartId = cartId
    this.checkoutCartItems = checkoutCartItems
    this.discounts = discounts
    this.taxes = taxes

    this.differentBillingAddress = differentBillingAddress
    if (shippingAddress) this.shippingAddress = shippingAddress
    if (billingAddress) this.billingAddress = billingAddress
    if (shippingRate) this.shippingRate = shippingRate
  }

  addItem(shoppingCartItem: CheckoutCartItem) {
    this.checkoutCartItems.push(shoppingCartItem)
  }

  clearTax() {
    this.taxes = []
  }
  changeTax(taxes: Tax[]) {
    this.taxes = taxes
  }
  addTax(tax: Tax) {
    this.taxes.push(tax)
  }

  computeTax(subtotal = 0) {
    if (!subtotal) subtotal = this.computeSubTotal()
    const taxDetails: TaxDetail[] = []
    let totalTaxAmount = 0
    this.taxes.forEach(tax => {
      const taxAmount = tax.computeTax(subtotal)
      taxDetails.push({
        taxDetail: tax,
        taxAmount,
      })
      totalTaxAmount += taxAmount
    })

    return {
      taxableAmount: subtotal,
      totalTaxAmount,
      taxDetails,
    }
  }

  addDiscount(discount: DiscountContract) {
    if (!this.discounts.map(discount => discount.discountId).includes(discount.discountId)) {
      this.discounts.push(discount)
    } else {
      throw new Error('Discount has already been added')
    }
  }
  clearDiscount() {
    this.discounts = []
  }
  removeDiscounts(ids: number[]) {
    this.discounts = this.discounts.filter(discount => {
      return !ids.includes(discount.discountId)
    })
  }

  computeSubTotal() {
    let price = 0
    this.checkoutCartItems.forEach(cartItem => {
      price += cartItem.getTotalPrice(this.discounts.filter(discount => {
        return discount.modifierScope === EModifierScope.EveryCartItem
      })).totalPrice
    })

    // entire order discounts
    this.discounts.filter(discount => {
      return discount.modifierScope === EModifierScope.FinalPrice
    }).forEach(discount => {
      price = discount.getPrice(price)
    })

    return price
  }

  getItemDetailSubtotal() {
    const applicableDiscounts = this.discounts.filter(discount => {
      return discount.modifierScope === EModifierScope.EveryCartItem
    })

    return this.checkoutCartItems.map(cartItem => {
      const itemTotal = cartItem.getTotalPrice(applicableDiscounts)
      return {
        cartItem,
        itemSubTotal: itemTotal.totalPrice,
        discounts: itemTotal.discountDetails,
      }
    })
  }

  getCheckoutCartDetailSubtotal() {
    const itemDetailSubtotal = this.getItemDetailSubtotal()
    const itemSubtotalAmountBeforeDiscount = itemDetailSubtotal.length > 0 ? itemDetailSubtotal
      .map(item => item.itemSubTotal)
      .reduce((sum, item) => sum + item) : 0
    let finalSubtotalBeforeTax = itemSubtotalAmountBeforeDiscount

    const orderDiscounts: IDiscountDetail[] = this.discounts.filter(discount => {
      return discount.modifierScope === EModifierScope.FinalPrice
    }).map(discount => {
      const afterDiscount = discount.getPrice(finalSubtotalBeforeTax)
      const appliedAmount = finalSubtotalBeforeTax - afterDiscount
      finalSubtotalBeforeTax = afterDiscount
      return {
        discount,
        appliedAmount,
        subtotal: finalSubtotalBeforeTax,
      }
    })

    return {
      itemDetailSubtotal,
      itemSubtotalAmountBeforeDiscount,
      orderDiscounts,
      finalSubtotalBeforeTax,
      discounts: this.discounts,
    }
  }

  getCheckoutCartGrandTotal() {
    // 计算订单总价
    const detailedSubtotal = this.getCheckoutCartDetailSubtotal()
    // 计算税
    const detailedTax = this.computeTax(detailedSubtotal.finalSubtotalBeforeTax)
    // 获得总价
    return {
      grandTotal: detailedTax.taxableAmount
        + detailedTax.totalTaxAmount + (this.shippingRate ? this.shippingRate.rate : 0),

      detailedTax,
      detailedSubtotal
    }
  }

  updateShippingAddress(address: Address) {
    this.shippingAddress = address
    if (!this.differentBillingAddress) {
      this.billingAddress = address
    }
  }
  updateBillingAddress(differentBillingAddress: boolean, address: Address|null = null) {
    if (differentBillingAddress && address) {
      this.differentBillingAddress = true
      this.billingAddress = address
    } else {
      if (!this.shippingAddress) throw new Error('Please specify shipping address first!')
      this.differentBillingAddress = false
      this.billingAddress = this.shippingAddress
    }
  }

  updateShippingRate(rate: CheckoutShippingRate) {
    this.shippingRate = rate
  }

  checkIfAbleToInitPayment(throwsError = false) {
    const errorHandler = (error, errorCode) => {
      if (throwsError) {
        throw new ServiceError(error, errorCode)
      } else {
        return false
      }
    }
    // check if cart empty
    if (this.checkoutCartItems.length <= 0) return errorHandler('CannotCheckoutEmptyCart', EErrorCode.CannotCheckoutEmptyCart)
    // check addresses
    if (!this.shippingAddress) return errorHandler('Please specify shipping address first', EErrorCode.NoShippingAddress)
    if (this.differentBillingAddress && !this.billingAddress) return errorHandler('Please specify billing address first', EErrorCode.NoBillingAddress)

    return true
  }

  toJSON() {
    const subtotalBeforeTax = this.getCheckoutCartDetailSubtotal()
    const taxDetails = this.computeTax(subtotalBeforeTax.finalSubtotalBeforeTax)

    let finalAmount = subtotalBeforeTax.finalSubtotalBeforeTax
    if (taxDetails && taxDetails.hasOwnProperty('totalTaxAmount')) {
      finalAmount += taxDetails.totalTaxAmount
    }
    if (this.shippingRate) {
      finalAmount += this.shippingRate.rate
    }

    return {
      allowCheckout: this.checkoutCartItems.length > 0,
      notAllowReason: this.checkoutCartItems.length > 0 ? undefined : 'Items in your cart are no longer available',
      cartId: this.cartId,
      subtotalBeforeTax,
      shippingAddress: this.shippingAddress,
      differentBillingAddress: this.differentBillingAddress,
      billingAddress: this.billingAddress,
      taxDetails,
      shippingRate: this.shippingRate,
      finalAmount
    }
  }

  serialize() {
    return flatted.stringify({
      cartId: this.cartId,
      cartItems: this.checkoutCartItems.map(cartItem => cartItem.serialize()),
      taxes: this.taxes.map(tax => tax.serialize()),
      discounts: this.discounts.map(discount => discount.serialize()),
      shippingAddress: this.shippingAddress,
      differentBillingAddress: this.differentBillingAddress,
      billingAddress: this.billingAddress,
      shippingRate: this.shippingRate ? this.shippingRate.serialize() : null
    })
  }

  static deserialize(data: string) {
    const struct: serializedCheckoutCart = flatted.parse(data)
    const cartItems = struct.cartItems.map(item => {
      return CheckoutCartItem.deserialize(item)
    })
    const taxes = struct.taxes.map(taxString => {
      return Tax.deserialize(taxString)
    })
    const discounts = struct.discounts.map(stringDiscount => {
      const discountOptions = flatted.parse(stringDiscount)
      return DiscountHelper.buildDiscountFromObject(discountOptions)
    })
    const shippingRate = struct.shippingRate ? CheckoutShippingRate.deserialize(struct.shippingRate) : null
    return new CheckoutCart(struct.cartId, cartItems, discounts, taxes,
      struct.shippingAddress, struct.differentBillingAddress, struct.billingAddress, shippingRate)
  }
}
