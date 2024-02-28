import ICheckoutCartPromotion from './ICheckoutCartPromotion'

export default interface ICheckoutCart{
  cartId: string;
  promotions: ICheckoutCartPromotion[];
  normalPrice: number;
  checkoutPrice: number;
}
