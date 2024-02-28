'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_order_items',
      'total_price',
      {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      })
    await queryInterface.addColumn('user_order_items',
      'single_price',
      {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      })
    await queryInterface.addColumn('user_order_items',
      'user_id',
      {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_order_items', 'total_price')
    await queryInterface.removeColumn('user_order_items', 'single_price')
    await queryInterface.removeColumn('user_order_items', 'user_id')
  }
};
