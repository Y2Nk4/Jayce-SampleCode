export interface IFetchShoppingCartParams {
  page?: number;
}

export interface IAddItemToCartParams {
  variantId: number;
  amount?: number;
}

export interface IChangeItemAmountParams {
  cartItemId: number;
  amount?: number;
}

export interface IRemoveItemFromCartParams {
  cartItemId: string|number;
}

export interface IShoppingCartItemProductDetail{
  id: number;
  title: string;
  description: string;
}

export interface IShoppingCartItemVariantDetail{
  id: number;
  sku_name: string;
  barcode: string;
  price: number;
  has_discount: boolean;
  normal_price: number;
  is_track_quantity: boolean;
  stock_quantity: number;
}

export interface IShoppingCartItem {
  id: number;
  product_id: number;
  variant_id: number;
  amount: number;
  is_saved_for_later: boolean;
  r_amount: number;
  product: IShoppingCartItemProductDetail;
  variant: IShoppingCartItemVariantDetail;
}
