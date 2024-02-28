import ShoppingCartContract from './shoppingCartContract'
import IShoppingCartItem from '../../interface/shoppingCart/IShoppingCartItem'
import { Op } from 'sequelize'

export default class loggedInUserShoppingCart extends ShoppingCartContract {
  constructor(ctx) {
    super(ctx)
    console.log('instanized')
  }

  async getItemsAmount(user: { id: number }) : Promise<number> {
    const { app } = this
    return app.model.UserShoppingCartItem.count({
      where: {
        user_id: user.id,
      },
    })
  }

  async clearCart(user: { id: number }) : Promise<number> {
    const { app } = this
    return app.model.UserShoppingCartItem.destroy({
      where: {
        user_id: user.id,
      },
    })
  }

  async getShoppingCart(user: { id: number }) : Promise<IShoppingCartItem[]> {
    const { app } = this
    const shoppingCartItems = await app.model.UserShoppingCartItem.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        'product', 'variant',
        'product_image', 'variant_image'
      ],
    })

    return shoppingCartItems.map(item => {
      return {
        id: item.id,
        user_id: item.user_id,
        product: item.product,
        variant: item.variant,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_image: item.product_image,
        variant_image: item.variant_image,
        amount: item.amount,
        is_saved_for_later: item.is_saved_for_later,
      }
    })
  }

  async addToCart(variantId: number, user: { id: number }, amount: number = 1) {
    const { app } = this

    const productVariant = await this.variantLookup(variantId)
    if (!productVariant) return Promise.reject(new Error(`Cannot Find Variant: ${variantId}`))

    const shoppingCartItem = await app.model.UserShoppingCartItem.findOne({
      where: {
        product_id: productVariant.product_id,
        variant_id: variantId,
        user_id: user.id,
      },
    })

    const transaction = await app.model.transaction()

    if (shoppingCartItem) {
      await shoppingCartItem.increment({
        amount,
      }, { transaction })
    } else {
      await app.model.UserShoppingCartItem.addToCart(productVariant, user, amount, transaction)
    }

    await transaction.commit()

    return Promise.resolve()
  }

  async removeItemsFromCart(itemIds: string[], user) {
    const { app } = this
    return app.model.UserShoppingCartItem.destroy({
      where: {
        user_id: user.id,
        id: {
          [Op.in]: itemIds,
        },
      },
    })
  }

  async removeItemFromCart(itemId: string, user) {
    return this.removeItemsFromCart([ itemId ], user)
  }

  async saveItemsForLater(itemIds: string[], user: { id: number }) {
    const { app } = this
    return app.model.UserShoppingCartItem.update({
      is_saved_for_later: true,
    }, {
      where: {
        user_id: user.id,
        id: {
          [Op.in]: itemIds,
        },
      },
    })
  }
  async changeItemAmount(itemId: string, amount: number, user: { id: number }) {
    const { app } = this
    return app.model.UserShoppingCartItem.update({
      amount,
    }, {
      where: {
        user_id: user.id,
        id: itemId,
      },
    })
  }
  async saveItemForLater(itemId: string, user: { id: number }) {
    return this.saveItemsForLater([ itemId ], user)
  }

  async moveItemsToCart(itemIds: string[], user: { id: number }) {
    const { app } = this
    return app.model.UserShoppingCartItem.update({
      is_saved_for_later: false,
    }, {
      where: {
        user_id: user.id,
        id: {
          [Op.in]: itemIds,
        },
      },
    })
  }
  async moveItemToCart(itemId: string, user: { id: number }) {
    return this.moveItemsToCart([ itemId ], user)
  }
}
