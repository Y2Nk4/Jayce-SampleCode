'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment_gateway_logs', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      payment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      payment_gateway: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },

      gateway_status_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bank_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_method_last4: {
        type: Sequelize.STRING,
        allowNull: true
      },

      log: {
        type: Sequelize.TEXT('long'),
        allowNull: true
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
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payment_gateway_logs')
  }
};
