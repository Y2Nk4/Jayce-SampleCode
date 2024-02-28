// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUtcDate from '../../../app/utils/utcDate';

declare module 'egg' {
  interface Application {
    utils: T_utils;
  }

  interface T_utils {
    utcDate: ExportUtcDate;
  }
}
