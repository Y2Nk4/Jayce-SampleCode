import { Controller } from 'egg'
import * as bcrypt from 'bcrypt'

export default class UserSettingsController extends Controller {
  async addAddress() {
    const { ctx } = this

    const valid = await ctx.validate({
      currentPassword: { type: 'string', required: true },
      newPassword: { type: 'string', required: true },
      newPasswordConfirm: { type: 'string', required: true },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { currentPassword, newPassword, newPasswordConfirm } = ctx.request.body
    const { user } = ctx.state

    if (newPassword !== newPasswordConfirm) {
      return ctx.error('New Password does not match', 400)
    }

    if (!user.validatePassword(currentPassword)) {
      return ctx.error('Current Password does not match', 400)
    }

    const result = await user.update({
      password: bcrypt.hashSync(newPassword, 10),
    })
    console.log(result)

    return ctx.success()
  }
}
