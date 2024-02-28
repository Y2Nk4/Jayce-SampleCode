import { Controller } from 'egg'

export default class UserManageController extends Controller {
  async getUserList() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      size: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 20) },
      page: { type: 'integer', required: false, transform: (val) => (val ? Number(val) : 1) }
    }, ctx.request.query, 'rule')
    if (!valid) return

    let { size = 2, page = 1 } = ctx.request.query
    size = Number(size)
    page = Number(page)

    const users = await app.model.User.findAndCountAll({
      limit: size,
      offset: (page - 1) * size
    })

    return ctx.success({
      dataRows: app.resource.admin.user.userResource(users.rows),
      pagination: {
        total: users.count,
        page,
        size
      }
    })
  }

  async getUserDetail() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      userId: { type: 'integer', required: false, transform: Number },
    }, ctx.request.query, 'rule')
    if (!valid) return

    const { userId } = ctx.request.query

    const user = await app.model.User.getUserById(userId)

    if (!user) return ctx.error('User Not Found', 404)

    return ctx.success(app.resource.admin.user.userSimpleInfoResource(user))
  }

  async getUserAddresses() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      userId: { type: 'integer', required: false, transform: Number },
    }, ctx.request.query, 'rule')
    if (!valid) return

    const { userId } = ctx.request.query

    const addresses = await app.model.UserAddress.findAll({
      where: {
        user_id: userId
      }
    })

    return ctx.success(app.resource.addressResource(addresses))
  }
}
