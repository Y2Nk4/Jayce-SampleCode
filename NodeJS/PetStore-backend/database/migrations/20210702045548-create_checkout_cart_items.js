'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('checkout_cart_items', {
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
      checkout_cart_payment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      variant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      total_price: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      single_price: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      cache_cart_item_id: {
        type: Sequelize.STRING,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('checkout_cart_items')
  }
};
