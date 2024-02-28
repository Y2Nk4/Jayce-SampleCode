import {
  Module, VuexModule, MutationAction, Action, Mutation
} from 'vuex-module-decorators'
import { IFetchProductDetailParams, IImage, IGetProductByTypeRequestParams } from '@/struct/IProduct'
import productApi from '../../api/product'

@Module({
  namespaced: true
})
export default class Auth extends VuexModule {
  productDetail = {}
  productImages = new Map()
  variantImages = new Map()

  @Mutation
  async SET_PRODUCT_IMAGES(images: IImage[]) {
    console.log('set image')
    images.forEach((image) => {
      const productImages = this.productImages.get(image.content_id.toString()) || []
      productImages.push(image)
      this.productImages.set(image.content_id.toString(), productImages)
    })
  }
  @Mutation
  async SET_VARIANT_IMAGES(images: IImage[]) {
    images.forEach((image) => {
      const productImages = this.variantImages.get(image.content_id.toString()) || []
      productImages.push(image)
      this.variantImages.set(image.content_id.toString(), productImages)
    })
  }

  @MutationAction({ mutate: ['productDetail'], rawError: true })
  async getProductDetail(params: IFetchProductDetailParams) {
    const res = await productApi.getProductDetail(params)
    return {
      productDetail: res.data.data
    }
  }

  @Action({ rawError: true })
  async getProductByType(params: IGetProductByTypeRequestParams) {
    const res = await productApi.getProductByType(params)
    return res.data.data
  }

  @Action({ rawError: true })
  async getImages(params: { productIds: number[], variantIds: number[] }) {
    const { productIds, variantIds } = params
    const queryProductIds = productIds
      ? productIds.filter((id) => !Array.from(this.productImages.keys()).includes(id.toString())) : []
    const queryVariantIds = variantIds
      ? variantIds.filter((id) => !Array.from(this.variantImages.keys()).includes(id.toString())) : []

    console.log('variantIds', variantIds)

    if (queryProductIds.length > 0 || queryVariantIds.length > 0) {
      const res = await productApi.getImages({
        productIds: queryProductIds.length > 0 ? queryProductIds.join(',') : undefined,
        variantIds: queryVariantIds.length > 0 ? queryVariantIds.join(',') : undefined,
      })

      const { data } = res.data

      this.context.commit('SET_PRODUCT_IMAGES', data.productImages)
      this.context.commit('SET_VARIANT_IMAGES', data.variantImages)
    }
  }
}
