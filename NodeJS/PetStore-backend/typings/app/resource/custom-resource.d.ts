// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAddressResource from '../../../app/resource/AddressResource';
import ExportProductImageResource from '../../../app/resource/ProductImageResource';
import ExportProductResource from '../../../app/resource/ProductResource';
import ExportProductVariantResource from '../../../app/resource/ProductVariantResource';
import ExportResourceResponse from '../../../app/resource/ResourceResponse';
import ExportShippingRateResource from '../../../app/resource/ShippingRateResource';
import ExportShoppingCartItemResource from '../../../app/resource/ShoppingCartItemResource';
import ExportSimpleTagResource from '../../../app/resource/SimpleTagResource';
import ExportSimpleTypeResource from '../../../app/resource/SimpleTypeResource';
import ExportTagResource from '../../../app/resource/TagResource';
import ExportTypeResource from '../../../app/resource/TypeResource';
import ExportUserInfoResource from '../../../app/resource/UserInfoResource';
import ExportUserPaymentDetailResource from '../../../app/resource/UserPaymentDetailResource';
import ExportCommonCamelCaseResource from '../../../app/resource/common/CamelCaseResource';
import ExportCommonSnakeCaseResource from '../../../app/resource/common/SnakeCaseResource';
import ExportOrderOrderItemResource from '../../../app/resource/order/OrderItemResource';
import ExportOrderUserOrderResource from '../../../app/resource/order/UserOrderResource';
import ExportAdminOrderOrderItemResource from '../../../app/resource/admin/order/OrderItemResource';
import ExportAdminOrderOrderSimpleInfoResource from '../../../app/resource/admin/order/OrderSimpleInfoResource';
import ExportAdminPaymentCheckoutCartItemResource from '../../../app/resource/admin/payment/CheckoutCartItemResource';
import ExportAdminPaymentPaymentDetailResource from '../../../app/resource/admin/payment/PaymentDetailResource';
import ExportAdminPaymentPaymentMethodResource from '../../../app/resource/admin/payment/PaymentMethodResource';
import ExportAdminProductProductDetailResource from '../../../app/resource/admin/product/ProductDetailResource';
import ExportAdminProductProductSimpleInfoResource from '../../../app/resource/admin/product/ProductSimpleInfoResource';
import ExportAdminProductVariantResource from '../../../app/resource/admin/product/VariantResource';
import ExportAdminUserAddressResource from '../../../app/resource/admin/user/AddressResource';
import ExportAdminUserUserResource from '../../../app/resource/admin/user/UserResource';
import ExportAdminUserUserSimpleInfoResource from '../../../app/resource/admin/user/UserSimpleInfoResource';

declare module 'egg' {
  interface Application {
    resource: T_custom_resource;
  }

  interface T_custom_resource {
    addressResource: AutoInstanceType<typeof ExportAddressResource>;
    productImageResource: AutoInstanceType<typeof ExportProductImageResource>;
    productResource: AutoInstanceType<typeof ExportProductResource>;
    productVariantResource: AutoInstanceType<typeof ExportProductVariantResource>;
    resourceResponse: AutoInstanceType<typeof ExportResourceResponse>;
    shippingRateResource: AutoInstanceType<typeof ExportShippingRateResource>;
    shoppingCartItemResource: AutoInstanceType<typeof ExportShoppingCartItemResource>;
    simpleTagResource: AutoInstanceType<typeof ExportSimpleTagResource>;
    simpleTypeResource: AutoInstanceType<typeof ExportSimpleTypeResource>;
    tagResource: AutoInstanceType<typeof ExportTagResource>;
    typeResource: AutoInstanceType<typeof ExportTypeResource>;
    userInfoResource: AutoInstanceType<typeof ExportUserInfoResource>;
    userPaymentDetailResource: AutoInstanceType<typeof ExportUserPaymentDetailResource>;
    common: {
      camelCaseResource: AutoInstanceType<typeof ExportCommonCamelCaseResource>;
      snakeCaseResource: AutoInstanceType<typeof ExportCommonSnakeCaseResource>;
    }
    order: {
      orderItemResource: AutoInstanceType<typeof ExportOrderOrderItemResource>;
      userOrderResource: AutoInstanceType<typeof ExportOrderUserOrderResource>;
    }
    admin: {
      order: {
        orderItemResource: AutoInstanceType<typeof ExportAdminOrderOrderItemResource>;
        orderSimpleInfoResource: AutoInstanceType<typeof ExportAdminOrderOrderSimpleInfoResource>;
      }
      payment: {
        checkoutCartItemResource: AutoInstanceType<typeof ExportAdminPaymentCheckoutCartItemResource>;
        paymentDetailResource: AutoInstanceType<typeof ExportAdminPaymentPaymentDetailResource>;
        paymentMethodResource: AutoInstanceType<typeof ExportAdminPaymentPaymentMethodResource>;
      }
      product: {
        productDetailResource: AutoInstanceType<typeof ExportAdminProductProductDetailResource>;
        productSimpleInfoResource: AutoInstanceType<typeof ExportAdminProductProductSimpleInfoResource>;
        variantResource: AutoInstanceType<typeof ExportAdminProductVariantResource>;
      }
      user: {
        addressResource: AutoInstanceType<typeof ExportAdminUserAddressResource>;
        userResource: AutoInstanceType<typeof ExportAdminUserUserResource>;
        userSimpleInfoResource: AutoInstanceType<typeof ExportAdminUserUserSimpleInfoResource>;
      }
    }
  }
}
