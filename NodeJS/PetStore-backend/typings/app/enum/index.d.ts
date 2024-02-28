// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
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
    enum: T_enum;
  }

  interface T_enum {
    eAddressTypes: ExportEAddressTypes;
    eContentTypes: ExportEContentTypes;
    eDiscountTypes: ExportEDiscountTypes;
    eErrorCode: ExportEErrorCode;
    eModifierScope: ExportEModifierScope;
    eModifierTypes: ExportEModifierTypes;
    ePaymentGatewaySymbol: ExportEPaymentGatewaySymbol;
    ePaymentGatewaysToSysStatusMap: ExportEPaymentGatewaysToSysStatusMap;
    ePaymentStatusCode: ExportEPaymentStatusCode;
    eProductStatus: ExportEProductStatus;
    eProductVariantStatus: ExportEProductVariantStatus;
    eUserOrderStatus: ExportEUserOrderStatus;
    eVariantStockHistoryActionType: ExportEVariantStockHistoryActionType;
  }
}
