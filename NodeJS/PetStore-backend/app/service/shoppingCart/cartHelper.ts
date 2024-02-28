import { Service, IModel } from 'egg'

export default class CartHelper extends Service {
  async movingCartFromGuestCart(user: IModel['User']) {
    const { service } = this

    let cartItems = await service.shoppingCart.guestShoppingCart.getShoppingCart()

    if (cartItems && cartItems.length > 0) {
      let queue = Promise.resolve()

      cartItems.forEach((item) => {
        queue = queue.then(() => service.shoppingCart.loggedInUserShoppingCart.addToCart(item.variant_id, user, item.amount))
      })

      queue.then(() => service.shoppingCart.guestShoppingCart.clearCart(null))
      await queue
    }
    return Promise.resolve()
  }
}
