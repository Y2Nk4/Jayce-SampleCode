import { Service } from 'egg'
import IShoppingCartItem from '../../interface/shoppingCart/IShoppingCartItem'
import { Op } from 'sequelize'
import EProductVariantStatus from '../../enum/EProductVariantStatus'

export default abstract class shoppingCartContract extends Service {

  abstract getShoppingCart (user: { id: number }): Promise<IShoppingCartItem[]>
  abstract addToCart (variantId: number, user: { id: number })
  abstract removeItemsFromCart (itemId: string[], user: { id: number })
  abstract changeItemAmount (changeAmount: string, amount: number, user: { id: number })
  abstract removeItemFromCart (itemId: string, user: { id: number })
  abstract saveItemForLater (itemIds: string, user: { id: number })
  abstract saveItemsForLater (itemIds: string[], user: { id: number })
  abstract moveItemToCart (itemIds: string, user: { id: number })
  abstract moveItemsToCart (itemIds: string[], user: { id: number })
  abstract getItemsAmount (user: { id: number })
  abstract clearCart(user: { id: number })

  variantLookup(variantId: number) {
    const { app } = this
    return app.model.ProductVariant.findById(variantId, true, {
      status: { [Op.notIn]: [ EProductVariantStatus.Draft, EProductVariantStatus.Unavailable ] },
    })
  }
}
