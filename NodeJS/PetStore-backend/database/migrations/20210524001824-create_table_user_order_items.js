'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_order_items', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      order_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      variant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      item_snapshot: {
        type: Sequelize.TEXT
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_order_items')
  }
}
