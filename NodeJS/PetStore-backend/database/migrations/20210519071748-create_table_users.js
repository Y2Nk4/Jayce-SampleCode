'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      // 用户身份信息相关
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      email_verified_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      remember_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      token_version: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: 1
      },

      // 账户状态控制，封禁相关
      status: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 1,
        allowNull: false,
        comment: '1.正常 2.安全冻结 3.临时冻结 4.禁言 5.永久封禁'
      },
      ban_until: {
        type: Sequelize.DATE,
        allowNull: true
      },
      banned_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      ban_reason: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // 余额
      balance: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
      },

      // 基本时间信息
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
};
