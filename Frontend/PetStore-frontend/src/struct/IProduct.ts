import { IPagination } from './ICommon'

export interface IFetchProductDetailParams{
  productId: number;
}

export interface IGetImagesParams{
  productIds?: string;
  variantIds?: string;
}

export interface IImage{
  id: number;
  title: string;
  image_link: string;
  content_type: number;
  content_id: number;
}

export interface IGetProductByTypeRequestParams extends IPagination{
  tagId: number;
}
