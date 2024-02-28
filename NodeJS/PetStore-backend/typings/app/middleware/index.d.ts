// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdminAuth from '../../../app/middleware/adminAuth';
import ExportAuth from '../../../app/middleware/auth';
import ExportNotFoundHandler from '../../../app/middleware/notFoundHandler';
import ExportSessionId from '../../../app/middleware/sessionId';

declare module 'egg' {
  interface IMiddleware {
    adminAuth: typeof ExportAdminAuth;
    auth: typeof ExportAuth;
    notFoundHandler: typeof ExportNotFoundHandler;
    sessionId: typeof ExportSessionId;
  }
}
