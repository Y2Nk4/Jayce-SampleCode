// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportServiceError from '../../../app/exception/ServiceError';

declare module 'egg' {
  interface Application {
    exception: T_custom_exception;
  }

  interface T_custom_exception {
    serviceError: AutoInstanceType<typeof ExportServiceError>;
  }
}
