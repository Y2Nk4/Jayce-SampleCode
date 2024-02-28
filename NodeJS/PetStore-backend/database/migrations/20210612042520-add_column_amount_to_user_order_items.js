'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_order_items', 'amount', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_order_items', 'amount')
  }
};
