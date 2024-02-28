'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('payment_gateway_temp_info', 'checkout_cart_payment_gateway_detail')
    await queryInterface.renameColumn('checkout_cart_payment_gateway_detail', 'payment_fee', 'transaction_fee')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('checkout_cart_payment_gateway_detail', 'payment_gateway_temp_info')
    await queryInterface.renameColumn('payment_gateway_temp_info', 'payment_fee', 'transaction_fee')
  }
}
