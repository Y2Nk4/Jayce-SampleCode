export default abstract class CartItemModifier {
  public modifierType
  public modifierScope
  public discountType

  getPrice(price: number) {
    return price
  }
  computeTax(_price: number) {
    return 0
  }
}
