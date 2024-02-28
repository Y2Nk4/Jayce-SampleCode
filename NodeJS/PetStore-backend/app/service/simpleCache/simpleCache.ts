import { Service } from 'egg'

export default class SimpleCache extends Service {
  async get(key: string) {
    return await this.app.redis.get(`sc_${key}`)
  }

  async set(key: string, content: string, ttl: number) {
    // 7 * 24 * 60 * 60 = 604800
    await this.app.redis.setex(`sc_${key}`, ttl, content)

    return Promise.resolve()
  }

  async getOrSet(key: string, ttl: number, func: () => Promise<string>) {
    // 7 * 24 * 60 * 60 = 604800
    const cache = await this.app.redis.get(`sc_${key}`)

    if (cache !== null) {
      return cache
    }

    const content = await func()

    await this.app.redis.setex(`sc_${key}`, ttl, content)

    return Promise.resolve()
  }
}