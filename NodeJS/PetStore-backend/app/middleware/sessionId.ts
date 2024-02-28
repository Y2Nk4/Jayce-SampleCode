import { v4 as uuidv4 } from 'uuid'

export default () => {
  return async function sessionId(ctx, next) {
    console.log('ctx.session.userSessionId', ctx.session.userSessionId)

    if (!ctx.session.userSessionId){
      ctx.session.userSessionId = uuidv4()
    }
    await next()
  }
}
