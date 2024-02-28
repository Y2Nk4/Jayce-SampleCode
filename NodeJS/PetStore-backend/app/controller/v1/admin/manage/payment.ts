import { Controller } from 'egg'

export default class PaymentController extends Controller {
  async getPaymentList() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      size: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 20) },
      page: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 1) }
    }, ctx.request.query, 'rule')
    if (!valid) return

    let { size = 2, page = 1 } = ctx.request.query
    size = Number(size)
    page = Number(page)

    const paymentResult = await app.model.CheckoutCartPayment.findAndCountAll({
      limit: size,
      offset: (page - 1) * size,
      order: [
        [ 'id', 'DESC' ]
      ],
    })

    return ctx.success({
      dataRows: app.resource.admin.payment.paymentDetailResource(paymentResult.rows),
      pagination: {
        total: paymentResult.count,
        page,
        size
      }
    })
  }

  async getAllPaymentMethods() {
    const { ctx, app } = this

    const paymentMethods = await app.model.PaymentMethod
      .scope('displayOnly').findAll()

    return ctx.success(app.resource.admin.payment.paymentMethodResource(paymentMethods))
  }

  async getPaymentDetail() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      paymentId: { type: 'integer', required: false, transform: Number },
    }, ctx.request.query, 'rule')
    if (!valid) return

    const userPayment = await app.model.CheckoutCartPayment.findOne({
      where: {
        id: ctx.request.query.paymentId
      },
      include: [ 'userSimpleInfo' ]
    })

    if (!userPayment) return ctx.error('User Payment did not find', 404)

    const items = await app.model.CheckoutCartItem.findAll({
      where: {
        checkout_cart_payment_id: userPayment.id
      },
      include: [ 'variant' ]
    })

    userPayment.items = items
    return ctx.success(app.resource.admin.payment.paymentDetailResource(userPayment))
  }
}
