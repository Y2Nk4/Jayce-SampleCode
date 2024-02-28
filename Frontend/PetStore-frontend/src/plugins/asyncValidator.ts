import Schema, { Rules } from 'async-validator'

export default (descriptor: Rules, data: object) =>
  new Promise<void>((resolve, reject) => {
    const validator = new Schema(descriptor)
    validator.validate(data, {}, (error, fields) => {
      if (!error || error.length === 0) {
        return resolve()
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return reject({ error, fields })
    })
  })
