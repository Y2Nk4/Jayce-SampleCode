'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('checkout_cart_discount')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('checkout_cart_discount', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      checkout_cart_payment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      cart_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      discount_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    })
  }
};
