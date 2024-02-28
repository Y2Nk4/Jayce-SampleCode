import { Controller } from 'egg'
import { Op } from 'sequelize'

export default class OrderManageController extends Controller {
  async getOrderList() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      size: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 20) },
      page: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 1) },
      status: {
        type: 'array',
        required: false,
        fields: {
          0: {
            type: 'integer',
            required: true,
          },
        },
        transform: val => (val ? val.split(',').map(val => Number(val)) : undefined),
      }
    }, ctx.request.query, 'rule')
    if (!valid) return

    let { size = 2, page = 1, status } = ctx.request.query
    size = Number(size)
    page = Number(page)

    const includeModels = [ 'items' ]
    const whereFilter: any = {}

    console.log(ctx.request.query)

    if (!ctx.request.query.userId) includeModels.push('userSimpleInfo')
    if (ctx.request.query.hasOwnProperty('userId')) {
      whereFilter.user_id = ctx.request.query.userId
    }
    if (status) {
      whereFilter.status = {
        [Op.in]: status.split(',').map(val => Number(val))
      }
    }

    const orders = await app.model.UserOrder.findAndCountAll({
      where: whereFilter,
      order: [
        [ 'id', 'DESC' ]
      ],
      include: includeModels,
      limit: size,
      offset: (page - 1) * size
    })

    return ctx.success({
      dataRows: app.resource.admin.order.orderSimpleInfoResource(orders.rows),
      pagination: {
        total: orders.count,
        page,
        size
      }
    })
  }

  async getOrderDetail() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      orderId: { type: 'integer', required: false, transform: Number }
    }, ctx.request.query, 'rule')
    if (!valid) return

    const { orderId } = ctx.request.query

    console.log(orderId)

    const order = await app.model.UserOrder.findOne({
      where: {
        id: orderId
      },
      include: [
        'items', 'detailPayment', 'addresses', 'userSimpleInfo'
      ]
    })

    if (!order) return ctx.error('Order Not Found', 404)

    return ctx.success(app.resource.admin.order.orderSimpleInfoResource(order))
  }
}
