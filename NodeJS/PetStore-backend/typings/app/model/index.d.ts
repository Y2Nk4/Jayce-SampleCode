// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdmin from '../../../app/model/Admin';
import ExportCheckoutCartItem from '../../../app/model/CheckoutCartItem';
import ExportCheckoutCartLockedItem from '../../../app/model/CheckoutCartLockedItem';
import ExportCheckoutCartPayment from '../../../app/model/CheckoutCartPayment';
import ExportCheckoutCartPaymentGatewayDetail from '../../../app/model/CheckoutCartPaymentGatewayDetail';
import ExportDiscount from '../../../app/model/Discount';
import ExportDiscountProductVariant from '../../../app/model/DiscountProductVariant';
import ExportFileInfo from '../../../app/model/FileInfo';
import ExportPaymentGatewayLog from '../../../app/model/PaymentGatewayLog';
import ExportPaymentMethod from '../../../app/model/PaymentMethod';
import ExportPostalCode from '../../../app/model/PostalCode';
import ExportProduct from '../../../app/model/Product';
import ExportProductImage from '../../../app/model/ProductImage';
import ExportProductSnapshot from '../../../app/model/ProductSnapshot';
import ExportProductVariant from '../../../app/model/ProductVariant';
import ExportShippingRate from '../../../app/model/ShippingRate';
import ExportTag from '../../../app/model/Tag';
import ExportType from '../../../app/model/Type';
import ExportUser from '../../../app/model/User';
import ExportUserAddress from '../../../app/model/UserAddress';
import ExportUserOrder from '../../../app/model/UserOrder';
import ExportUserOrderAddress from '../../../app/model/UserOrderAddress';
import ExportUserOrderDiscount from '../../../app/model/UserOrderDiscount';
import ExportUserOrderItem from '../../../app/model/UserOrderItem';
import ExportUserOrderLogistics from '../../../app/model/UserOrderLogistics';
import ExportUserOrderShipping from '../../../app/model/UserOrderShipping';
import ExportUserPayment from '../../../app/model/UserPayment';
import ExportUserShoppingCartItem from '../../../app/model/UserShoppingCartItem';
import ExportVariantStockHistory from '../../../app/model/VariantStockHistory';

declare module 'egg' {
  interface IModel {
    Admin: ReturnType<typeof ExportAdmin>;
    CheckoutCartItem: ReturnType<typeof ExportCheckoutCartItem>;
    CheckoutCartLockedItem: ReturnType<typeof ExportCheckoutCartLockedItem>;
    CheckoutCartPayment: ReturnType<typeof ExportCheckoutCartPayment>;
    CheckoutCartPaymentGatewayDetail: ReturnType<typeof ExportCheckoutCartPaymentGatewayDetail>;
    Discount: ReturnType<typeof ExportDiscount>;
    DiscountProductVariant: ReturnType<typeof ExportDiscountProductVariant>;
    FileInfo: ReturnType<typeof ExportFileInfo>;
    PaymentGatewayLog: ReturnType<typeof ExportPaymentGatewayLog>;
    PaymentMethod: ReturnType<typeof ExportPaymentMethod>;
    PostalCode: ReturnType<typeof ExportPostalCode>;
    Product: ReturnType<typeof ExportProduct>;
    ProductImage: ReturnType<typeof ExportProductImage>;
    ProductSnapshot: ReturnType<typeof ExportProductSnapshot>;
    ProductVariant: ReturnType<typeof ExportProductVariant>;
    ShippingRate: ReturnType<typeof ExportShippingRate>;
    Tag: ReturnType<typeof ExportTag>;
    Type: ReturnType<typeof ExportType>;
    User: ReturnType<typeof ExportUser>;
    UserAddress: ReturnType<typeof ExportUserAddress>;
    UserOrder: ReturnType<typeof ExportUserOrder>;
    UserOrderAddress: ReturnType<typeof ExportUserOrderAddress>;
    UserOrderDiscount: ReturnType<typeof ExportUserOrderDiscount>;
    UserOrderItem: ReturnType<typeof ExportUserOrderItem>;
    UserOrderLogistics: ReturnType<typeof ExportUserOrderLogistics>;
    UserOrderShipping: ReturnType<typeof ExportUserOrderShipping>;
    UserPayment: ReturnType<typeof ExportUserPayment>;
    UserShoppingCartItem: ReturnType<typeof ExportUserShoppingCartItem>;
    VariantStockHistory: ReturnType<typeof ExportVariantStockHistory>;
  }
}
