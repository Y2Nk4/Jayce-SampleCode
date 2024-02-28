export default class ServiceError extends Error {
  errorCode: number|string

  constructor(message: string, errorCode: number|string) {
    super(message)
    this.errorCode = errorCode
  }
}
