import { Controller } from 'egg'
import * as bcrypt from 'bcrypt'

class AuthController extends Controller {
  async register() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      username: { type: 'string', required: true },
      email: { type: 'email', required: true },
      password: { type: 'string', required: true },
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
      confirmPassword: {
        type: 'string', required: true,
        validator: (_rule, value) => value === ctx.request.body.password,
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { username, email, password, confirmPassword, firstName, lastName } = ctx.request.body
    // 检查用户名和邮箱是否已经被占用
    const chkResult = await Promise.all([
      app.model.User.count({ where: { username } }),
      app.model.User.count({ where: { email } }),
    ])
    if (chkResult[0] > 0) {
      return ctx.error('Username has been taken', 401)
    } else if (chkResult[1] > 0) {
      return ctx.error('Email has been used', 401)
    }

    if (confirmPassword !== password) return ctx.error('Confirm Password is not the same as Password', 401)

    const user = await app.model.User.create({
      nickname: username,
      username,
      first_name: firstName,
      last_name: lastName,
      password: bcrypt.hashSync(password, 10),
      email,
    })

    await this.service.shoppingCart.cartHelper.movingCartFromGuestCart(user)

    return ctx.success({
      token: user.generateJWTToken(),
    })
  }

  async login() {
    const { ctx, app } = this
    console.log('ctx.request.body', ctx.request.body)
    const valid = await ctx.validate({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { username, password } = ctx.request.body
    let user: typeof app.model.User = null
    if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(username)) {
      user = await app.model.User.getUserByEmail(username)
    } else {
      user = await app.model.User.getUserByUsername(username)
    }

    if (!user) {
      return ctx.error('Username and password do not match', 401)
    }
    if (user.validatePassword(password)) {
      // 验证成功
      await this.service.shoppingCart.cartHelper.movingCartFromGuestCart(user)

      return ctx.success({
        token: user.generateJWTToken(),
      })
    }
    return ctx.error('Username and password do not match', 401)
  }

  async forgetPassword() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      username: { type: 'string', required: true },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { username } = ctx.request.body
    let user: typeof app.model.User = null
    if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(username)) {
      user = await app.model.User.getUserByEmail(username)
    } else {
      user = await app.model.User.getUserByUsername(username)
    }

    if (!user) {
      return ctx.success('An email has been sent to your email')
    }
    // 补充email发送，重置密码规则
    return ctx.success('An email has been sent to your email')

  }

  async changePassword() {

  }

  async userInfo() {
    const { ctx, app } = this
    console.log(app.resource.userInfoResource)
    return ctx.success(app.resource.userInfoResource(ctx.state.user))
  }
}

export default AuthController
