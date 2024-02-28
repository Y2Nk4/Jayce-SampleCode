import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1621316968246_2207'
  config.proxy = true

  // add your egg config in here
  config.middleware = [ 'notFoundHandler', 'sessionId' ]
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    session: {
      key: 'P_SESS',
      maxAge: 24 * 3600 * 1000, // 1 天
      httpOnly: true,
      encrypt: true,
      secure: false,
      signed: true,
      sameSite: 'None'
    },

    customLoader: {
      enum: {
        directory: 'app/enum',
      },
      exception: {
        directory: 'app/exception',
        call: false,
        initializer: model => model
      },
      appService: {
        directory: 'app/appService',
        inject: 'app',
      },
      resource: {
        directory: 'app/resource',
        call: false,
      },
      utils: {
        directory: 'app/utils',
        inject: 'app',
      },
    },

    stripe: {
      skKey: process.env.STRIPE_SK_KEY || '',
      endpointSecret: process.env.STRIPE_ENDPOINT_SECRET || ''
    },

    sequelize: {
      dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      define: {
        timestamps: false,
      },
      // delegate: 'myModel', // load all models to `app[delegate]` and `ctx[delegate]`, default to `model`
      // baseDir: 'my_model', // load all files in `app/${baseDir}` as models, default to `model`
      // exclude: 'index.js', // ignore `app/${baseDir}/index.js` when load models, support glob and array
      // more sequelize options
    },

    auth: {
      secret: 'JXWVTSvk86DPCalcxMZj9nmzdfoY5Qs7', // 自定义 token 的加密条件字符串
    },

    adminAuth: {
      secret: 'JXWVTSvk86DPCxhjMZj9nmzdfoY5Qs7', // 自定义 token 的加密条件字符串
      key: 'admin', // 自定义 token 的加密条件字符串
    },

    security: {
      csrf: {
        enable: false,
      },
    },

    multipart: {
      mode: 'file',
      whitelist: () => true
    },

    ratelimiter: {
      // db: {},//如已配置egg-redis 可删除此配置
      router: [],
    },

    redis: {
      client: {
        // host
        host: process.env.REDIS_HOST,
        // port
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS,
        db: '0',
      },
      // load into app, default is open
      app: true,
      // load into agent, default is close
      agent: true,
    },

    validatePlusNext: {
      resolveError(ctx, errors) {
        if (errors.length) {
          ctx.type = 'json'
          ctx.status = 400
          ctx.body = {
            code: 400,
            error: errors,
            message: 'Invalid Parameters',
          }
        }
      },
    },

    cors: {
      origin: 'http://localhost:8080',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: true,
    },

    bus: {
      debug: true, // Debug 模式下会打印更多日志信息
      concurrency: 1, // Bull 中队列处理的并发数：https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueprocess
      listener: {
        ignore: null, // 忽略目录中的某些文件，https://eggjs.org/zh-cn/advanced/loader.html#ignore-string
        baseDir: 'listener',
        options: { // Bull Job 配置： https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
          attempts: 5,
          backoff: {
            delay: 3000,
            type: 'fixed',
          },
        }
      },
      job: {
        // 与 listener 一致，唯一不同的就是 默认 baseDir 的值为 `job`
      },
      bull: { // Bull 队列配置：https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queue
        redis: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          password: process.env.REDIS_PASS,
          db: 0,
        },
      },

      queue: {
        default: 'default', // 默认队列名称
        prefix: 'bus', // 队列前缀
      },
      queues: { // 针对不同队列单独配置

        // 比如针对默认队列更改 redis 端口
        default: {
        }
      },
    },
    usps: {
      user: process.env.USPS_USER
    }
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  }
}
