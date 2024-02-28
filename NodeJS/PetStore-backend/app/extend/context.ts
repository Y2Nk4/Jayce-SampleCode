import { Context } from 'egg'

export default {
  success(this: Context, data: any = null) {
    this.body = {
      success: true,
      data: (data !== null) ? data : undefined,
    }
  },
  error(this: Context, message, statusCode = 200, returnCode = 0) {
    this.status = statusCode
    this.body = {
      success: false,
      error: message,
      code: returnCode || statusCode,
    }
  },
}
