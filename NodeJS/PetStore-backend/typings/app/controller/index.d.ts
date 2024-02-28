// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportV1AdminAuth from '../../../app/controller/v1/admin/auth';
import ExportV1ApiStripeWebhook from '../../../app/controller/v1/api/stripeWebhook';
import ExportV1CheckoutCheckout from '../../../app/controller/v1/checkout/checkout';
import ExportV1StoreHome from '../../../app/controller/v1/store/home';
import ExportV1StoreProduct from '../../../app/controller/v1/store/product';
import ExportV1StoreSearch from '../../../app/controller/v1/store/search';
import ExportV1StoreShipping from '../../../app/controller/v1/store/shipping';
import ExportV1UserAddress from '../../../app/controller/v1/user/address';
import ExportV1UserAuth from '../../../app/controller/v1/user/auth';
import ExportV1UserHome from '../../../app/controller/v1/user/home';
import ExportV1UserOrder from '../../../app/controller/v1/user/order';
import ExportV1UserSettings from '../../../app/controller/v1/user/settings';
import ExportV1UserShoppingCart from '../../../app/controller/v1/user/shoppingCart';
import ExportV1AdminManageFileAsset from '../../../app/controller/v1/admin/manage/fileAsset';
import ExportV1AdminManageOrder from '../../../app/controller/v1/admin/manage/order';
import ExportV1AdminManagePayment from '../../../app/controller/v1/admin/manage/payment';
import ExportV1AdminManageProduct from '../../../app/controller/v1/admin/manage/product';
import ExportV1AdminManageUser from '../../../app/controller/v1/admin/manage/user';

declare module 'egg' {
  interface IController {
    v1: {
      admin: {
        auth: ExportV1AdminAuth;
        manage: {
          fileAsset: ExportV1AdminManageFileAsset;
          order: ExportV1AdminManageOrder;
          payment: ExportV1AdminManagePayment;
          product: ExportV1AdminManageProduct;
          user: ExportV1AdminManageUser;
        }
      }
      api: {
        stripeWebhook: ExportV1ApiStripeWebhook;
      }
      checkout: {
        checkout: ExportV1CheckoutCheckout;
      }
      store: {
        home: ExportV1StoreHome;
        product: ExportV1StoreProduct;
        search: ExportV1StoreSearch;
        shipping: ExportV1StoreShipping;
      }
      user: {
        address: ExportV1UserAddress;
        auth: ExportV1UserAuth;
        home: ExportV1UserHome;
        order: ExportV1UserOrder;
        settings: ExportV1UserSettings;
        shoppingCart: ExportV1UserShoppingCart;
      }
    }
  }
}
