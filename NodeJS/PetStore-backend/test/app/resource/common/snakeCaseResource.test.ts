import * as assert from 'assert'
import { app } from 'egg-mock/bootstrap'

describe('test/app/controller/home.test.ts', () => {
  it('should GET /', async () => {
    const testData = {
      status: '1',
      skuName: '3-lb bag',
      barcode: '2132323',
      price: '2000',
      isTrackQuantity: 'false',
      stockQuantity: '0',
      hasDiscount: '1',
      normalPrice: 3000
    }

    const result = app.resource.common.snakeCaseResource(testData)

    assert.deepStrictEqual(result, {
      status: '1',
      sku_name: '3-lb bag',
      barcode: '2132323',
      price: '2000',
      is_track_quantity: 'false',
      stock_quantity: '0',
      has_discount: '1',
      normal_price: 3000
    })
  })
})
