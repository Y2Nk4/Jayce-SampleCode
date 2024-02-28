'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_orders', 'paid_at', {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.addColumn('user_orders', 'auto_canceled_at', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_orders', 'paid_at')
    await queryInterface.dropTable('user_orders', 'auto_canceled_at')
  }
};
