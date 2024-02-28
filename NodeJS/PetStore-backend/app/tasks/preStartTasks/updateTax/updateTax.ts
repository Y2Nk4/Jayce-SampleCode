import US from './drivers/US'
import DriverContract from './drivers/DriverContract'

export default class updateTax {
  protected static dataDriver: DriverContract[] = [
    new US(),
  ]

  static async updateTax(app) {
    const taskQueue = Promise.resolve()
    this.dataDriver.forEach(driver => {
      taskQueue.then(async () => {
        const data = await driver.update()
      })
    })
  }
}
