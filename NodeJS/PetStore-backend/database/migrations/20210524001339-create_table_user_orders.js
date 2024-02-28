'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_orders', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      status: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        comment: '0.未付款 1.已付款 3.已发货 4.取消 5.待评价 6.完成'
      },
      payment_method: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        comment: '0.免费 1.credit cards'
      },
      payment_gateway_transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '支付网关的交易id'
      },
      amount: {
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
    await queryInterface.dropTable('user_orders')
  }
}
