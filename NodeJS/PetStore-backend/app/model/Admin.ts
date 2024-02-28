import * as bcrypt from 'bcrypt'
import * as userEncryptToken from '../util/userEncryptedToken'
import * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export default app => {
  const Sequelize = app.Sequelize

  const Admin = app.model.define('Admin', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    // 用户基本信息
    nickname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
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
    tableName: 'admins',
  })

  Admin.prototype.generateJWTToken = function() {
    const userToken = {
      name: this.username,
      id: this.id,
      token: userEncryptToken.encrypt({
        u: uuidv4(),
        v: this.token_version,
      }, app.config.adminAuth.secret),
    }

    return jwt.sign(userToken, app.config.adminAuth.secret)
  }

  Admin.getAdminByEmail = async function(email) {
    return Admin.findOne({
      where: {
        email,
      },
    })
  }

  Admin.getAdminByUsername = async function(username) {
    return Admin.findOne({
      where: {
        username,
      },
    })
  }

  Admin.getAdminById = async function(id) {
    return Admin.findOne({
      where: {
        id,
      },
    })
  }

  Admin.prototype.validatePassword = function(this: typeof Admin, password: string) {
    return bcrypt.compareSync(password, this.password)
  }

  return Admin
}
