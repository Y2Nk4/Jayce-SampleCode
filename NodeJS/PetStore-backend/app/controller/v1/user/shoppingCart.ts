import { Controller } from 'egg'
import ShoppingCartItemResource from '../../../resource/ShoppingCartItemResource'

export default class ShoppingCartController extends Controller {
  async addToCart() {
    const { ctx, service } = this
    const valid = await ctx.validate({
      variantId: { type: 'integer', required: true, transform: val => Number(val) },
      amount: { type: 'integer', required: true, transform: val => (val ? Number(val) : 1) },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { variantId, amount } = ctx.request.body
    const loggedInUser = ctx.state.user

    try {
      if (loggedInUser) {
        // 已登录用户
        await service.shoppingCart.loggedInUserShoppingCart.addToCart(variantId, loggedInUser, amount)
      } else {
        // 未登录用户
        await service.shoppingCart.guestShoppingCart.addToCart(variantId, null, amount)
      }
      return ctx.success()
    } catch (e) {
      return ctx.error(`Failed to add to cart: ${e.message}`, 200)
    }
  }

  async getShippingCart() {
    const { ctx, service } = this
    const loggedInUser = ctx.state.user
    try {
      if (loggedInUser) {
        const shoppingCartItems = await service.shoppingCart.loggedInUserShoppingCart.getShoppingCart(loggedInUser)

        return ctx.success(ShoppingCartItemResource(shoppingCartItems))
      }
      const shoppingCartItems = await service.shoppingCart.guestShoppingCart.getShoppingCart(null)
      console.log('shoppingCartItems', shoppingCartItems)
      return ctx.success(ShoppingCartItemResource(shoppingCartItems))

    } catch (e) {
      console.log(e)
      return ctx.error(e.message, 500)
    }
  }

  async getItemsAmount() {
    const { ctx, service } = this
    const loggedInUser = ctx.state.user
    let amount
    try {
      if (loggedInUser) {
        amount = await service.shoppingCart.loggedInUserShoppingCart.getItemsAmount(loggedInUser)
      } else {
        amount = await service.shoppingCart.guestShoppingCart.getItemsAmount(null)
      }
    } catch (e) {
      console.log(e)
      return ctx.error(e.message, 500)
    }
    return ctx.success(amount || 0)
  }

  async saveForLater() {
    const { ctx, service } = this
    const valid = await ctx.validate({
      cartItemId: { type: 'array', required: true,
        transform: val => (val ? val.split(',') : val),
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    let { cartItemId } = ctx.request.body
    const loggedInUser = ctx.state.user

    cartItemId = cartItemId.split(',')
    console.log('cartItemId', cartItemId)

    if (loggedInUser) {
      // 已登录用户
      await service.shoppingCart.loggedInUserShoppingCart.saveItemsForLater(cartItemId, loggedInUser)
    } else {
      // 未登录用户
      await service.shoppingCart.guestShoppingCart.saveItemForLater(cartItemId, null)
    }

    return ctx.success('success')
  }

  async changeItemAmount() {
    const { ctx, service } = this
    const valid = await ctx.validate({
      cartItemId: { type: 'string', required: true },
      amount: {
        type: 'integer', required: true, transform: val => Number(val),
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    let { cartItemId, amount } = ctx.request.body
    const loggedInUser = ctx.state.user

    console.log('cartItemId', cartItemId)

    amount = Number(amount)

    if (amount <= 0) {
      if (loggedInUser) {
        // 已登录用户
        await service.shoppingCart.loggedInUserShoppingCart.removeItemFromCart(cartItemId, loggedInUser)
      } else {
        // 未登录用户
        await service.shoppingCart.guestShoppingCart.removeItemFromCart(cartItemId, null)
      }
    } else {
      if (loggedInUser) {
        // 已登录用户
        await service.shoppingCart.loggedInUserShoppingCart.changeItemAmount(cartItemId, amount, loggedInUser)
      } else {
        // 未登录用户
        await service.shoppingCart.guestShoppingCart.changeItemAmount(cartItemId, amount, null)
      }
    }

    return ctx.success('success')
  }

  async moveToCart() {
    const { ctx, service } = this
    const valid = await ctx.validate({
      cartItemId: { type: 'array', required: true,
        transform: val => (val ? val.split(',') : val),
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    let { cartItemId } = ctx.request.body
    const loggedInUser = ctx.state.user

    cartItemId = cartItemId.split(',')
    console.log('cartItemId', cartItemId)

    if (loggedInUser) {
      // 已登录用户
      await service.shoppingCart.loggedInUserShoppingCart.moveItemsToCart(cartItemId, loggedInUser)
    } else {
      // 未登录用户
      await service.shoppingCart.guestShoppingCart.moveItemsToCart(cartItemId, null)
    }

    return ctx.success('success')
  }

  async removeFromCart() {
    const { ctx, service } = this
    const valid = await ctx.validate({
      cartItemId: { type: 'array', required: true,
        transform: val => (val ? val.split(',') : val),
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    let { cartItemId } = ctx.request.body
    const loggedInUser = ctx.state.user

    cartItemId = cartItemId.split(',')
    console.log('cartItemId', cartItemId)

    if (loggedInUser) {
      // 已登录用户
      await service.shoppingCart.loggedInUserShoppingCart.removeItemsFromCart(cartItemId, loggedInUser)
    } else {
      // 未登录用户
      await service.shoppingCart.guestShoppingCart.removeItemsFromCart(cartItemId, null)
    }

    return ctx.success('success')
  }
}
