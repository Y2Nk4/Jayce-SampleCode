'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_order_shipping', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      checkout_cart_payment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      order_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },

      shipping_rate_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      rate: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_order_shipping')
  }
};
