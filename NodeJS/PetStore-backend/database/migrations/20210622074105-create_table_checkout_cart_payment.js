'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('checkout_cart_payment', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cart_id: {
        type: Sequelize.STRING,
        allowNull: false
      },

      payment_amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'unit: cent'
      },

      status: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      gateway_status: {
        type: Sequelize.STRING
      },

      payment_gateway: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      payment_session_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_transaction_id: {
        type: Sequelize.STRING,
        allowNull: true
      },

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
    await queryInterface.dropTable('checkout_cart_payment')
  }
};
