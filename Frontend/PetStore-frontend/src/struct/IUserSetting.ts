export interface IAddress{
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  company?: string;
  city: string;
  country: string;
  zipCode: string;
  state: string;
  phone: string;
  addressType: number;
}
export interface IAddressOptional{
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  company?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  state?: string;
  phone?: string;
}

export interface IAddAddressParams extends IAddress {
  addressType: number;
}

export interface IEditAddressParams extends IAddress {
  addressId: number;
}

export interface IGetAddressParams{
  addressType?: number;
}

export interface IUpdateShippingAddressParams extends IAddress{
  checkoutCartId: string;
}

export interface IUpdateBillingAddressParams extends IAddressOptional{
  checkoutCartId: string;
  differentBillingAddress?: number;
}
