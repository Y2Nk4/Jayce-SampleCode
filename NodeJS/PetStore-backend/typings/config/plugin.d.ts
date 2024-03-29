// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import 'egg-onerror';
import 'egg-session';
import 'egg-i18n';
import 'egg-watcher';
import 'egg-multipart';
import 'egg-security';
import 'egg-development';
import 'egg-logrotator';
import 'egg-schedule';
import 'egg-static';
import 'egg-jsonp';
import 'egg-view';
import 'egg-sequelize';
import 'egg-validate-plus-next';
import 'egg-jwt';
import 'egg-redis';
import 'egg-session-redis';
import 'egg-ratelimiter';
import 'egg-cors';
import 'egg-bus';
import 'egg-router-group';
import { EggPluginItem } from 'egg';
declare module 'egg' {
  interface EggPlugin {
    onerror?: EggPluginItem;
    session?: EggPluginItem;
    i18n?: EggPluginItem;
    watcher?: EggPluginItem;
    multipart?: EggPluginItem;
    security?: EggPluginItem;
    development?: EggPluginItem;
    logrotator?: EggPluginItem;
    schedule?: EggPluginItem;
    static?: EggPluginItem;
    jsonp?: EggPluginItem;
    view?: EggPluginItem;
    sequelize?: EggPluginItem;
    validate?: EggPluginItem;
    jwt?: EggPluginItem;
    redis?: EggPluginItem;
    sessionRedis?: EggPluginItem;
    ratelimiter?: EggPluginItem;
    cors?: EggPluginItem;
    bus?: EggPluginItem;
    routerGroup?: EggPluginItem;
  }
}