'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkout_cart_payment', 'failed_reason', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('checkout_cart_payment', 'failed_code', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('checkout_cart_payment', 'failed_message', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkout_cart_payment', 'failed_reason')
    await queryInterface.removeColumn('checkout_cart_payment', 'failed_code')
    await queryInterface.removeColumn('checkout_cart_payment', 'failed_message')
  }
};
