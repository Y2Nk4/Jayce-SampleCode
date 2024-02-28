import { Controller } from 'egg'

export default class OrderController extends Controller {
  async getOrderList() {
    const { ctx, app } = this
    const loggedInUser = ctx.state.user

    const orders = await app.model.UserOrder.findAll({
      where: {
        user_id: loggedInUser.id,
      },
      order: [
        [ 'id', 'DESC' ]
      ],
      include: [
        {
          model: app.model.UserOrderItem,
          as: 'items'
        }
      ]
    })

    return ctx.success(app.resource.order.userOrderResource(orders))
  }

  async getOrderDetail() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      orderId: {
        required: true,
        type: 'integer',
        transform: Number
      }
    }, ctx.request.query, 'rule')
    if (!valid) return

    const loggedInUser = ctx.state.user

    console.log(ctx.request.query.orderId)

    const order = await app.model.UserOrder.findOne({
      where: {
        id: Number(ctx.request.query.orderId),
        user_id: loggedInUser.id,
      },
      include: [
        'logistics', 'discounts', 'items', 'payment'
      ]
    })

    return ctx.success(app.resource.order.userOrderResource(order))
  }

  async getOrderAddresses() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      orderId: {
        required: true,
        type: 'integer',
        transform: Number
      }
    }, ctx.request.query, 'rule')
    if (!valid) return

    const user = ctx.state.user
    const addresses = await app.model.UserOrderAddress.findAll({
      where: {
        order_id: ctx.request.query.orderId,
        user_id: user.id
      }
    })

    return ctx.success(app.resource.addressResource(addresses))
  }

  async getOrderPaymentDetail() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      orderId: {
        required: true,
        type: 'integer',
        transform: Number
      }
    }, ctx.request.query, 'rule')
    if (!valid) return

    const user = ctx.state.user
    const order = await app.model.UserOrder.findOne({
      where: {
        id: ctx.request.query.orderId,
        user_id: user.id
      },
      attributes: [
        'id', 'user_id', 'checkout_cart_payment_id'
      ],
      include: [
        'paymentGatewayDetailSimple', 'payment'
      ]
    })

    return ctx.success(order)
  }
}
