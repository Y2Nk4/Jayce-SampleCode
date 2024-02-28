import CheckoutCart from '../../../../app/lib/CheckoutCart/CheckoutCart'
import CheckoutCartItem from '../../../../app/lib/CheckoutCart/CheckoutCartItem'
import PercentageDiscount from '../../../../app/lib/Discount/PercentageDiscount'
import FixAmountDiscount from '../../../../app/lib/Discount/FixAmountDiscount'
import EModifierScope from '../../../../app/enum/EModifierScope'

import * as assert from 'assert'

describe('test/app/lib/CheckoutCart/checkoutCart.test.js', () => {
  it('CheckoutCart basic functions', async () => {
    const checkoutCart = new CheckoutCart('12323123', [], [], [])

    const tShirt: CheckoutCartItem = new CheckoutCartItem(
      1, 12, 'T-Shirt', 'black',
      2000, 2500, 3,
    )

    const discount10PercentOff = new PercentageDiscount({
      discountId: 122,
      discountName: '10% OFF Discount',
      discountValue: 1000,
      modifierScope: EModifierScope.EveryCartItem,
      applicableVariants: [ 1 ],
      applicableProducts: [],
    })
    const discount10USDOff = new FixAmountDiscount({
      discountId: 12,
      discountName: '10USD OFF Discount',
      discountValue: 1000,
      modifierScope: EModifierScope.EveryCartItem,
      applicableVariants: [ 1 ],
      applicableProducts: [],
    })

    checkoutCart.addItem(tShirt)
    assert(checkoutCart.computeSubTotal() === 6000)

    checkoutCart.addDiscount(discount10PercentOff)
    // 2000 * .9 * 3
    assert(checkoutCart.computeSubTotal() === 5400)
    console.log(checkoutCart.getCheckoutCartDetailSubtotal())
    assert(checkoutCart.computeSubTotal() ===
      checkoutCart.getCheckoutCartDetailSubtotal().finalSubtotalBeforeTax, 'check double discount')

    checkoutCart.addDiscount(discount10USDOff)
    assert(checkoutCart.computeSubTotal() === 2400, 'check fix amount discount')
    assert(checkoutCart.computeSubTotal() ===
      checkoutCart.getCheckoutCartDetailSubtotal().finalSubtotalBeforeTax, 'check double discount')

    assert.throws(() => {
      checkoutCart.addDiscount(discount10PercentOff)
    }, Error)
  })

  it('item discount to 0 USD', async () => {
    const checkoutCart = new CheckoutCart('12323123', [], [], [])

    const tShirt: CheckoutCartItem = new CheckoutCartItem(
      1, 12, 'T-Shirt', 'black', 2000, 2500, 3,
    )

    const discount20USDOff = new FixAmountDiscount({
      discountId: 12,
      discountName: '10USD OFF Discount',
      discountValue: 2000,
      modifierScope: EModifierScope.EveryCartItem,
      applicableVariants: [ 1 ],
      applicableProducts: [],
    })

    checkoutCart.addItem(tShirt)

    checkoutCart.addDiscount(discount20USDOff)
    // 2000 * .9 * 3
    assert(checkoutCart.computeSubTotal() === 0)

    assert.throws(() => checkoutCart.addDiscount(discount20USDOff), Error)
    assert(checkoutCart.computeSubTotal() === 0, 'apply discount twice')

    console.log(checkoutCart.serialize())

  })

  it('serialize test', async () => {
    const checkoutCart = new CheckoutCart('12323123', [], [], [])

    const tShirt: CheckoutCartItem = new CheckoutCartItem(
      1, 12, 'T-Shirt', 'black', 2000, 2500, 3,
    )

    const discount20USDOff = new FixAmountDiscount({
      discountId: 12,
      discountName: '10USD OFF Discount',
      discountValue: 2000,
      modifierScope: EModifierScope.EveryCartItem,
      applicableVariants: [ 1 ],
      applicableProducts: [],
    })

    checkoutCart.addItem(tShirt)

    checkoutCart.addDiscount(discount20USDOff)
    // 2000 * .9 * 3
    assert(checkoutCart.computeSubTotal() === 0)

    const serializedCart = checkoutCart.serialize()

    const checkoutCart2 = CheckoutCart.deserialize(serializedCart)

    assert(checkoutCart2.computeSubTotal() === 0, 'subtotal after de-serialization')

    checkoutCart2.clearDiscount()

    assert(checkoutCart2.computeSubTotal() === 6000, 'subtotal after de-serialization')
  })
})

