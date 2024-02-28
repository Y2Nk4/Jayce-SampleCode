export interface ICheckoutItem {
  variant_id: number;
  amount: number;
  cartItemId?: number|string;
}
export interface INotAvailableVariants {
  item: object;
  reason: string;
}

export interface ICheckoutParams{
  items: ICheckoutItem[];
}

export interface IAddDiscountParams {
  checkoutCartId: string;
  couponCode: string;
}

export interface IRemoveDiscountParams {
  checkoutCartId: string;
  couponCodeIds: string;
}

export interface ISelectShippingAddressParams{
  checkoutCartId: string;
  shippingRateId: number;
}

export interface IInitPaymentParams {
  checkoutCartId: string;
}

export interface ICancelPaymentParams {
  checkoutCartId: string;
  paymentId: number;
}

export interface ICheckoutPaymentResponse_payment{
  paymentId?: number;
  skipPaymentStep: boolean;
  orderId: number;

  payments: object[];
}

export interface ICheckoutPaymentResponse{
  payment: ICheckoutPaymentResponse_payment;
  cart: object;
}

export interface IFetchPaymentResultParams {
  paymentId: number;
}

export interface ISubmitPaymentParams {
  paymentId: number,
  checkoutCartId: number | string,
  paymentDetailId: number
}
