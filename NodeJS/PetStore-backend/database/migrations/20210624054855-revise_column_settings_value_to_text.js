'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('settings', 'value', {
      type: Sequelize.TEXT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('settings', 'value', {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
};
