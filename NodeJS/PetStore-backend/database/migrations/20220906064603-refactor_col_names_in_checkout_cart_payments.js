'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn('checkout_cart_payment', 'items_price', 'grand_total')
    await queryInterface.renameColumn('checkout_cart_payment', 'shipping_price', 'shipping_rate')
    await queryInterface.renameColumn('checkout_cart_payment', 'tax_price', 'tax_total')
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('checkout_cart_payment', 'grand_total', 'items_price')
    await queryInterface.renameColumn('checkout_cart_payment', 'shipping_rate', 'shipping_price')
    await queryInterface.renameColumn('checkout_cart_payment', 'tax_total', 'tax_price')
  }
};
