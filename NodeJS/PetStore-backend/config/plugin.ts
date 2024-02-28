import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  validate: {
    enable: true,
    package: 'egg-validate-plus-next',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis',
  },
  ratelimiter: {
    enable: true,
    package: 'egg-ratelimiter',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  bus: {
    enable: true,
    package: 'egg-bus'
  },
  routerGroup: {
    enable: true,
    package: 'egg-router-group'
  }
}

export default plugin
