import { Service, IModel } from 'egg'
import { Transaction, Op } from 'sequelize'

export default class CheckoutCartLockItem extends Service {
  async lockItem(variant: IModel['ProductVariant'], amount: number, userId: number, checkoutCartId: string, transaction: Transaction) {
    const { app } = this
    let result = await app.model.ProductVariant.update({
      stock_quantity: app.model.literal(variant.is_track_quantity ? `stock_quantity - ${amount}` : 'stock_quantity'),
      sold_quantity: app.model.literal(`sold_quantity + ${amount}`)
    }, {
      where: {
        id: variant.id,
        [Op.or]: [
          {
            is_track_quantity: false
          },
          {
            // 保证原子性
            stock_quantity: {
              [Op.gte]: amount
            }
          }
        ]
      },
      transaction
    })
    console.log('lockResult', result)

    if (variant.is_track_quantity) {
      await app.model.CheckoutCartLockedItem.create({
        product_id: variant.product_id,
        variant_id: variant.id,
        amount,
        checkout_cart_id: checkoutCartId,
        user_id: userId
      }, { transaction })
    }

    await app.model.VariantStockHistory.create({
      action: app.enum.eVariantStockHistoryActionType.CheckoutDecrement,
      delta_amount: -amount,
      variant_id: variant.id,
      checkout_cart_id: checkoutCartId,
      user_id: userId,
    })

    return Promise.resolve()
  }

  async releaseItems(checkoutCartId: string, userId: number, transaction: Transaction){
    const { app } = this
    let lockedItems = await app.model.CheckoutCartLockedItem.findAll({
      where: {
        user_id: userId,
        checkout_cart_id: checkoutCartId
      }
    }, { transaction })

    if (lockedItems.length <= 0) return Promise.resolve()

    let queue = Promise.resolve()
    lockedItems.forEach((lockedItem) => {
      queue = queue.then(async () => {
        await app.model.ProductVariant.update({
          stock_quantity: app.model.literal(`stock_quantity + ${lockedItem.amount}`),
          sold_quantity: app.model.literal(`sold_quantity - ${lockedItem.amount}`)
        }, {
          where: {
            id: lockedItem.variant_id
          },
          lock: transaction.LOCK.UPDATE,
          transaction
        })
        await lockedItem.destroy()

        await app.model.VariantStockHistory.create({
          action: app.enum.eVariantStockHistoryActionType.ReleaseItemIncrement,
          delta_amount: lockedItem.amount,
          variant_id: lockedItem.variant_id,
          checkout_cart_id: checkoutCartId,
          user_id: userId,
        })
        return Promise.resolve()
      })
    })
    await queue
  }
}
