import * as userEncryptToken from '../util/userEncryptedToken'
import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

export default app => {
  const Sequelize = app.Sequelize

  const User = app.model.define('users', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // 用户身份信息相关
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email_verified_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    remember_token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    token_version: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 1,
    },

    // 账户状态控制，封禁相关
    status: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
      comment: '1.正常 2.安全冻结 3.临时冻结 4.禁言 5.永久封禁',
    },
    ban_until: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    banned_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    ban_reason: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // 余额
    balance: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
    },

    // 基本时间信息
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'users',
    scopes: {
      simpleInfo: {
        attributes: [ 'id', 'username' ]
      }
    }
  })

  User.prototype.generateJWTToken = function(this: typeof User) {
    const userToken = {
      name: this.username,
      id: this.id,
      token: userEncryptToken.encrypt({
        u: uuidv4(),
        v: this.token_version,
      }, 'sd'),
    }

    return jwt.sign(userToken, app.config.auth.secret)
  }
  User.prototype.validatePassword = function(this: typeof User, password: string) {
    return bcrypt.compareSync(password, this.password)
  }

  User.getUserByEmail = async function(email) {
    return User.findOne({
      where: {
        email,
      },
    })
  }

  User.getUserByUsername = async function(username) {
    return User.findOne({
      where: {
        username,
      },
    })
  }

  User.getUserById = async function(id) {
    return User.findOne({
      where: {
        id,
      },
    })
  }

  User.associate = function() {
    app.model.User.hasMany(app.model.UserOrder, { as: 'orders', foreignKey: 'user_id' })
    app.model.User.hasMany(app.model.UserPayment, { as: 'payments', foreignKey: 'user_id' })
    app.model.User.hasMany(app.model.UserAddress, { as: 'addresses', foreignKey: 'user_id' })
    app.model.User.hasMany(app.model.UserShoppingCartItem, { as: 'shoppingCartItems', foreignKey: 'user_id' })
  }

  return User
}
