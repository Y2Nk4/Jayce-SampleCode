'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_addresses', 'created_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    })
    await queryInterface.addColumn('user_addresses', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_addresses', 'created_at')
    await queryInterface.dropTable('user_addresses', 'updated_at')
  }
};
