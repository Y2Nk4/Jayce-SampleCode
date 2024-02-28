'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_order_discounts', 'applied_to', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      comment: '0.specific variant 1.entire order',
    })
    await queryInterface.addColumn('user_order_discounts', 'variant_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_order_discounts', 'applied_to')
    await queryInterface.removeColumn('user_order_discounts', 'variant_id')
  }
};
