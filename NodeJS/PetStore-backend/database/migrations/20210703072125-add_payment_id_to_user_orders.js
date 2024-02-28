'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_orders',
      'checkout_cart_payment_id',
      {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      })

    await queryInterface.removeColumn('user_orders','payment_gateway_transaction_id')
    await queryInterface.removeColumn('user_orders','payment_method')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_orders', 'checkout_cart_payment_id')

    await queryInterface.addColumn('user_orders','payment_gateway_transaction_id', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: '支付网关的交易id',
    })
    await queryInterface.addColumn('user_orders','payment_method', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '0.免费 1.Stripe 2.CreditCards',
    })
  }
};
