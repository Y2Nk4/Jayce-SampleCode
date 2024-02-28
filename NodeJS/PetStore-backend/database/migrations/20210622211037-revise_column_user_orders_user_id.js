'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_orders', 'user_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true
    })
    await queryInterface.addColumn('user_orders', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_orders', 'user_id', {
      type: Sequelize.STRING,
      allowNull: false,
    })
    await queryInterface.removeColumn('user_orders', 'email')
  }
}
