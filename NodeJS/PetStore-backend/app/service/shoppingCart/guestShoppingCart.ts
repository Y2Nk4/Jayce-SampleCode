import ShoppingCartContract from './shoppingCartContract'
import IShoppingCartItem from '../../interface/shoppingCart/IShoppingCartItem'
import { v4 as uuidv4 } from 'uuid'
import * as flatted from 'flatted'
import { Op } from 'sequelize'
import * as _ from 'lodash'

export default class guestShoppingCart extends ShoppingCartContract {
  async getShoppingCartFromRedis(): Promise<IShoppingCartItem[]> {
    const { ctx } = this
    const sessionId = ctx.session.userSessionId
    const serializedCart = await this.app.redis.get(`${sessionId}/ShoppingCart`)
    if (serializedCart) return flatted.parse(serializedCart)
    return []
  }
  async saveShoppingCartToRedis(cartItems: IShoppingCartItem[]) {
    const { ctx } = this
    const sessionId = ctx.session.userSessionId
    return this.app.redis.setex(`${sessionId}/ShoppingCart`, 604800, flatted.stringify(cartItems))
  }
  async deleteCart() {
    const { ctx } = this
    const sessionId = ctx.session.userSessionId
    return this.app.redis.del(`${sessionId}/ShoppingCart`)
  }

  async addToCart(variantId: number, _user: { id: number }|null, amount = 1) {
    const { ctx } = this

    const productVariant = await this.variantLookup(variantId)
    if (!productVariant) return Promise.reject(new Error(`Cannot Find Variant: ${variantId}`))

    console.log('ctx.session', ctx.session)

    let foundItem = false
    let shoppingCart: IShoppingCartItem[] = await this.getShoppingCartFromRedis()
    console.log('getted', shoppingCart)

    shoppingCart = shoppingCart.filter(item => item).map(item => {
      if (item.product_id === productVariant.product_id && item.variant_id === productVariant.id) {
        foundItem = true
        item.amount += amount
      }
      return item
    })

    console.log('foundItem', foundItem)
    if (!foundItem) {
      shoppingCart.unshift({
        id: uuidv4(),
        variant_id: productVariant.id,
        product_id: productVariant.product_id,
        amount,
        is_saved_for_later: false
      })
    }

    console.log('shoppingCart', shoppingCart)

    await this.saveShoppingCartToRedis(shoppingCart)

    return Promise.resolve()
  }

  async getItemsAmount(_user: { id: number }|null) : Promise<number> {
    const items = await this.getShoppingCartFromRedis()
    return Promise.resolve(items.length)
  }

  async getShoppingCart(_user: { id: number }|null = null): Promise<IShoppingCartItem[]> {
    const shoppingCart = await this.getShoppingCartFromRedis()
    const { app } = this
    const shoppingCartItems = await app.model.ProductVariant.findAll({
      where: {
        id: {
          [Op.in]: shoppingCart.map(item => item.variant_id)
        }
      },
      includes: [{
        model: app.model.Product.scope('simpleInfo'),
        as: 'product'
      }]
    })
    console.log('shoppingCartItems', shoppingCartItems)
    const itemMap = _.keyBy(shoppingCartItems, 'id')

    return Promise.resolve(shoppingCart.map(item => {
      const variant = itemMap[item.variant_id.toString()]
      item.variant = variant
      item.product = variant.product
      return item
    }))
  }

  async clearCart(_user: { id: number }|null) {
    return this.deleteCart()
  }

  async removeItemsFromCart(itemIds: string[], _user) {
    let shoppingCart = await this.getShoppingCartFromRedis()
    shoppingCart = shoppingCart.filter(item => {
      const id = typeof item.id === 'string' ? item.id : item.id.toString()
      return !itemIds.includes(id)
    })

    return this.saveShoppingCartToRedis(shoppingCart)
  }

  async removeItemFromCart(itemId: string, _user) {
    return this.removeItemsFromCart([ itemId ], _user)
  }

  async saveItemsForLater(itemIds: string[], _user: { id: number }|null) {
    let shoppingCart = await this.getShoppingCartFromRedis()
    shoppingCart = shoppingCart.map(item => {
      const id = typeof item.id === 'string' ? item.id : item.id.toString()
      if (itemIds.includes(id)) {
        item.is_saved_for_later = true
      }
      return item
    })
    return this.saveShoppingCartToRedis(shoppingCart)
  }
  async changeItemAmount(itemId: string, amount: number, _user: { id: number }|null) {
    let shoppingCart = await this.getShoppingCartFromRedis()
    shoppingCart = shoppingCart.map(item => {
      if (item.id === itemId) {
        item.amount = amount
      }
      return item
    })
    return this.saveShoppingCartToRedis(shoppingCart)
  }
  async saveItemForLater(itemId: string, _user: { id: number }|null) {
    return this.saveItemsForLater([ itemId ], _user)
  }

  async moveItemsToCart(itemIds: string[], _user: { id: number }|null) {
    let shoppingCart = await this.getShoppingCartFromRedis()
    shoppingCart = shoppingCart.map(item => {
      const id = typeof item.id === 'string' ? item.id : item.id.toString()
      if (itemIds.includes(id)) {
        item.is_saved_for_later = false
      }
      return item
    })
    return this.saveShoppingCartToRedis(shoppingCart)
  }
  async moveItemToCart(itemId: string, _user: { id: number }|null) {
    return this.moveItemsToCart([ itemId ], _user)
  }
}
