'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('checkout_cart_payment', 'payment_gateway', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('checkout_cart_payment', 'payment_gateway', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false
    })
  }
};
