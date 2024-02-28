export default interface IShoppingCartItem {
  id: string|number
  user_id?: number
  product_id: number
  variant_id: number
  amount: number
  is_saved_for_later: boolean
  product?: object
  variant?: object
}
