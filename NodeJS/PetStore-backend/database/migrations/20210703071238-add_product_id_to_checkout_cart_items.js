'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkout_cart_items', 'product_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkout_cart_items', 'product_id')
  }
};
