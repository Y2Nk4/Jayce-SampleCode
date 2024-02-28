import * as encryptUtil from './aesEncrypt'
import * as flatted from 'flatted'

export function encrypt(content: object, secret: string) {
  return encryptUtil.aes128EcbEncrypt(flatted.stringify(content), secret)
}

export function decrypt(content: object, secret: string) {
  return flatted.parse(encryptUtil.aes128EcbDecrypt(content, secret))
}
