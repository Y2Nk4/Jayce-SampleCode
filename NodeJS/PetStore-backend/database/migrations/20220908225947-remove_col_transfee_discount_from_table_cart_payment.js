'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkout_cart_payment', 'transaction_fee')
    await queryInterface.removeColumn('checkout_cart_payment', 'payment_discount')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkout_cart_payment', 'transaction_fee', {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    })
    await queryInterface.removeColumn('checkout_cart_payment', 'payment_discount', {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    })
  }
};
