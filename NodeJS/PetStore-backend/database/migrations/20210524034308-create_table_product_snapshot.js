'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_snapshots', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        comment: '0.product 1.variant',
        defaultValue: 0
      },
      content_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      snapshot: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_snapshots')
  }
}
