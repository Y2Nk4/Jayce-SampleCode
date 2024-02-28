'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'type_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products', 'type_id')
  }
};
