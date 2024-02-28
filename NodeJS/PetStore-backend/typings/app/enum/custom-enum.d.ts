// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportEAddressTypes from '../../../app/enum/EAddressTypes';
import ExportEContentTypes from '../../../app/enum/EContentTypes';
import ExportEDiscountTypes from '../../../app/enum/EDiscountTypes';
import ExportEErrorCode from '../../../app/enum/EErrorCode';
import ExportEModifierScope from '../../../app/enum/EModifierScope';
import ExportEModifierTypes from '../../../app/enum/EModifierTypes';
import ExportEPaymentGatewaySymbol from '../../../app/enum/EPaymentGatewaySymbol';
import ExportEPaymentGatewaysToSysStatusMap from '../../../app/enum/EPaymentGatewaysToSysStatusMap';
import ExportEPaymentStatusCode from '../../../app/enum/EPaymentStatusCode';
import ExportEProductStatus from '../../../app/enum/EProductStatus';
import ExportEProductVariantStatus from '../../../app/enum/EProductVariantStatus';
import ExportEUserOrderStatus from '../../../app/enum/EUserOrderStatus';
import ExportEVariantStockHistoryActionType from '../../../app/enum/EVariantStockHistoryActionType';

declare module 'egg' {
  interface Application {
    enum: T_custom_enum;
  }

  interface T_custom_enum {
    eAddressTypes: AutoInstanceType<typeof ExportEAddressTypes>;
    eContentTypes: AutoInstanceType<typeof ExportEContentTypes>;
    eDiscountTypes: AutoInstanceType<typeof ExportEDiscountTypes>;
    eErrorCode: AutoInstanceType<typeof ExportEErrorCode>;
    eModifierScope: AutoInstanceType<typeof ExportEModifierScope>;
    eModifierTypes: AutoInstanceType<typeof ExportEModifierTypes>;
    ePaymentGatewaySymbol: AutoInstanceType<typeof ExportEPaymentGatewaySymbol>;
    ePaymentGatewaysToSysStatusMap: AutoInstanceType<typeof ExportEPaymentGatewaysToSysStatusMap>;
    ePaymentStatusCode: AutoInstanceType<typeof ExportEPaymentStatusCode>;
    eProductStatus: AutoInstanceType<typeof ExportEProductStatus>;
    eProductVariantStatus: AutoInstanceType<typeof ExportEProductVariantStatus>;
    eUserOrderStatus: AutoInstanceType<typeof ExportEUserOrderStatus>;
    eVariantStockHistoryActionType: AutoInstanceType<typeof ExportEVariantStockHistoryActionType>;
  }
}
