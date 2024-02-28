import * as koajwt from 'koa-jwt'

interface authOptions {
  allowPassthrough?: boolean
}

const defaultOptions: authOptions = {
  allowPassthrough: false,
}

export default (app, authOptions: authOptions = defaultOptions) => {
  const options = Object.assign({}, defaultOptions, authOptions)

  const jwtMiddleware = koajwt(Object.assign({
    passthrough: options.allowPassthrough,
  }, app.config.adminAuth, options))

  return async function auth(ctx, next) {
    return jwtMiddleware(ctx, async () => {
      await setLoggedInUser(ctx, next)
      return Promise.resolve()
    })
  }

  async function setLoggedInUser(ctx, next) {
    if (ctx.state.admin && ctx.state.admin.id) {
      ctx.state.jwtAdmin = ctx.state.admin
      const admin = await app.model.Admin.getAdminById(ctx.state.admin.id)
      if (admin) ctx.state.admin = admin
    }

    await next()
    return Promise.resolve()
  }
}
