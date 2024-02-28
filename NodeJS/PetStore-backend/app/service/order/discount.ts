import { IModel, Service } from 'egg'
import { Transaction, Op } from 'sequelize'
import CheckoutCart from '../../lib/CheckoutCart/CheckoutCart'

export default class DiscountService extends Service {
  async recordDiscount(checkoutCart: CheckoutCart,
    user: IModel['User'], discounts: IModel['Discount'][],
    payment: IModel['CheckoutCartPayment'], transaction: Transaction) {

    const { app } = this

    // 处理单独物品优惠
    const discountIds = discounts.map((discount) => discount.id)

    const checkoutSubtotal = checkoutCart.getCheckoutCartDetailSubtotal()
    const insertDiscounts: IModel['UserOrderDiscount'][] = []
    checkoutSubtotal.itemDetailSubtotal
      // 每个物品
      .filter((variantItem) => variantItem.discounts && variantItem.discounts.length > 0)
      .forEach((variantItem) => {
        variantItem.discounts.forEach((discountDetail) => {
          const discount = discountDetail.discount
          if (discountIds.includes(discount.discountId)) {
            insertDiscounts.push({
              checkout_cart_payment_id: payment.id,
              cart_id: checkoutCart.cartId,
              user_id: user.id,
              name: discount.discountName,
              applied_amount: discountDetail.appliedAmount,
              applied_to: discount.modifierScope,
              variant_id: variantItem.cartItem.variantId,
              discount_type: discount.discountType,
              discount_id: discount.discountId,
              discount_value: discount.discountValue
            })
          }
        })
      })

    // 处理订单优惠
    checkoutSubtotal.orderDiscounts
      .forEach((discountDetail) => {
        const discount = discountDetail.discount
        insertDiscounts.push({
          checkout_cart_payment_id: payment.id,
          cart_id: checkoutCart.cartId,
          user_id: user.id,
          name: discount.discountName,
          applied_amount: discountDetail.appliedAmount,
          applied_to: discount.modifierScope,
          discount_type: discount.discountType,
          discount_id: discount.discountId,
          discount_value: discount.discountValue
        })
      })

    // 记录使用的所有优惠
    await app.model.UserOrderDiscount.bulkCreate(insertDiscounts, { transaction })

    // 自增 used_amount
    let queue = Promise.resolve()
    discounts.forEach((discount) => {
      queue = queue.then(() => discount.increment('used_amount', { by: 1, transaction }))
    })

    await queue

    return Promise.resolve()
  }

  /**
   * retrieveCheckoutDiscount
   * 删除折扣使用记录，并减少折扣使用次数
   * */
  async retrieveCheckoutDiscount(userOrderDiscounts: IModel['UserOrderDiscount'][], transaction: Transaction) {
    const { app } = this
    let queue = Promise.resolve()
    // 减少 used_amount 次数
    const discounts = await app.model.Discount.findAll({
      where: {
        id: {
          [Op.in]: userOrderDiscounts.map((discount) => discount.discount_id)
        }
      },
      lock: transaction.LOCK.UPDATE
    }, { transaction })
    discounts.forEach((discount) => {
      queue = queue.then(() => discount.decrement('used_amount', { by: 1, transaction }))
    })

    // 清除 UserOrderDiscount 记录
    userOrderDiscounts.forEach((userOrderDiscount) => {
      queue = queue.then(() => userOrderDiscount.destroy())
    })
    await queue

    return Promise.resolve()
  }
}
