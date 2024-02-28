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
  }, app.config.auth, options))

  return async function auth(ctx, next) {
    return jwtMiddleware(ctx, async () => {
      await setLoggedInUser(ctx, next)
      return Promise.resolve()
    })
  }

  async function setLoggedInUser(ctx, next) {
    if (ctx.state.user && ctx.state.user.id) {
      ctx.state.jwtUser = ctx.state.user
      const user = await app.model.User.getUserById(ctx.state.user.id)
      if (user) ctx.state.user = user
    }

    await next()
    return Promise.resolve()
  }
}
