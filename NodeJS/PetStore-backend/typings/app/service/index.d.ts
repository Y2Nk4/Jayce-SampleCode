// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportTest from '../../../app/service/Test';
import ExportCheckoutCheckoutCartStorageService from '../../../app/service/checkout/CheckoutCartStorageService';
import ExportCheckoutCheckoutCartLockItem from '../../../app/service/checkout/checkoutCartLockItem';
import ExportOrderDiscount from '../../../app/service/order/discount';
import ExportOrderOrder from '../../../app/service/order/order';
import ExportOrderPaymentGateway from '../../../app/service/order/paymentGateway';
import ExportPaymentPaymentGateway from '../../../app/service/payment/paymentGateway';
import ExportShoppingCartCartHelper from '../../../app/service/shoppingCart/cartHelper';
import ExportShoppingCartGuestShoppingCart from '../../../app/service/shoppingCart/guestShoppingCart';
import ExportShoppingCartLoggedInUserShoppingCart from '../../../app/service/shoppingCart/loggedInUserShoppingCart';
import ExportShoppingCartShoppingCartContract from '../../../app/service/shoppingCart/shoppingCartContract';
import ExportSimpleCacheSimpleCache from '../../../app/service/simpleCache/simpleCache';
import ExportUspsUsps from '../../../app/service/usps/usps';
import ExportPaymentGatewaysFreeGateway from '../../../app/service/payment/gateways/freeGateway';
import ExportPaymentGatewaysGatewayContract from '../../../app/service/payment/gateways/gatewayContract';
import ExportPaymentGatewaysPayLaterGateway from '../../../app/service/payment/gateways/payLaterGateway';
import ExportPaymentGatewaysStripeGateway from '../../../app/service/payment/gateways/stripeGateway';

declare module 'egg' {
  interface IService {
    test: AutoInstanceType<typeof ExportTest>;
    checkout: {
      checkoutCartStorageService: AutoInstanceType<typeof ExportCheckoutCheckoutCartStorageService>;
      checkoutCartLockItem: AutoInstanceType<typeof ExportCheckoutCheckoutCartLockItem>;
    }
    order: {
      discount: AutoInstanceType<typeof ExportOrderDiscount>;
      order: AutoInstanceType<typeof ExportOrderOrder>;
      paymentGateway: AutoInstanceType<typeof ExportOrderPaymentGateway>;
    }
    payment: {
      paymentGateway: AutoInstanceType<typeof ExportPaymentPaymentGateway>;
      gateways: {
        freeGateway: AutoInstanceType<typeof ExportPaymentGatewaysFreeGateway>;
        gatewayContract: AutoInstanceType<typeof ExportPaymentGatewaysGatewayContract>;
        payLaterGateway: AutoInstanceType<typeof ExportPaymentGatewaysPayLaterGateway>;
        stripeGateway: AutoInstanceType<typeof ExportPaymentGatewaysStripeGateway>;
      }
    }
    shoppingCart: {
      cartHelper: AutoInstanceType<typeof ExportShoppingCartCartHelper>;
      guestShoppingCart: AutoInstanceType<typeof ExportShoppingCartGuestShoppingCart>;
      loggedInUserShoppingCart: AutoInstanceType<typeof ExportShoppingCartLoggedInUserShoppingCart>;
      shoppingCartContract: AutoInstanceType<typeof ExportShoppingCartShoppingCartContract>;
    }
    simpleCache: {
      simpleCache: AutoInstanceType<typeof ExportSimpleCacheSimpleCache>;
    }
    usps: {
      usps: AutoInstanceType<typeof ExportUspsUsps>;
    }
  }
}
