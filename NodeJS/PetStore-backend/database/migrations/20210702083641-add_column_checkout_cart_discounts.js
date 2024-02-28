'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkout_cart_discount', 'checkout_cart_payment_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkout_cart_discount', 'checkout_cart_payment_id')
  }
};
