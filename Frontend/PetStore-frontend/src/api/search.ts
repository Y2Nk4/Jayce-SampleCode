import fetch from './fetch'

export default {
  async searchProducts(keywords: string) {
    return fetch.post('/searchProducts', { keywords })
  }
}
