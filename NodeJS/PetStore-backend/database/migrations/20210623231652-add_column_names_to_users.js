'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: false,
    })
    await queryInterface.addColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'first_name')
    await queryInterface.removeColumn('users', 'last_name')
  }
};
