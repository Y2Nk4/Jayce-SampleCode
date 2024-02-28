import { IFetchProductDetailParams, IGetImagesParams, IGetProductByTypeRequestParams } from '@/struct/IProduct'

import fetch from './fetch'

export default {
  getProductDetail(params: IFetchProductDetailParams|undefined) {
    return fetch.get('/products/detail', params)
  },
  getImages(params: IGetImagesParams) {
    return fetch.get('/products/getImages', params)
  },
  getProductByType(params: IGetProductByTypeRequestParams) {
    return fetch.get('/products/getProductByType', params)
  }
}
