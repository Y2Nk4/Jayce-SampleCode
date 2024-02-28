'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_order_discounts',  'discount_id',{
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_order_discounts',  'discount_id')
  }
};
