'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkout_cart_payment', 'items_price', {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    })
    await queryInterface.addColumn('checkout_cart_payment', 'shipping_price', {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    })
    await queryInterface.addColumn('checkout_cart_payment', 'tax_price', {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkout_cart_payment', 'items_price')
    await queryInterface.removeColumn('checkout_cart_payment', 'shipping_price')
    await queryInterface.removeColumn('checkout_cart_payment', 'tax_price')
  }
}
