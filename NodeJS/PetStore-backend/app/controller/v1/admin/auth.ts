import { Controller } from 'egg'

export default class AdminAuthController extends Controller {
  async login() {
    const { ctx, app } = this
    let valid = await ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    }, ctx.request.body, 'rule')
    if(!valid) return

    const { username, password } = ctx.request.body
    let admin: typeof app.model.Admin = null
    if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(username)) {
      admin = await app.model.Admin.getAdminByEmail(username)
    } else {
      admin = await app.model.Admin.getAdminByUsername(username)
    }

    if (!admin) {
      return ctx.error('Username and password do not match', 400)
    }
    if (admin.validatePassword(password)) {
      // 验证成功
      return ctx.success({
        token: admin.generateJWTToken(),
      })
    }
    return ctx.error('Username and password do not match', 400)
  }
}
