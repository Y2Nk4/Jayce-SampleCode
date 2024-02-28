import * as cryptoJs from 'crypto-js'

export function aes128EcbEncrypt(plaintText, plainKey) {
  return cryptoJs.AES.encrypt(plaintText, plainKey, {
    mode: cryptoJs.mode.ECB,
    padding: cryptoJs.pad.Pkcs7,
  }).toString()
}

export function aes128EcbDecrypt(cipherText, plainKey) {
  return cryptoJs.AES.decrypt(cipherText, plainKey, {
    mode: cryptoJs.mode.ECB,
    padding: cryptoJs.pad.Pkcs7,
  }).toString(cryptoJs.enc.Utf8)
}
