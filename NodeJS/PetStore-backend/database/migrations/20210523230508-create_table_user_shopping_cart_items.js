'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_shopping_cart_items', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      variant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 1
      },
      is_saved_for_later: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      // 基本时间信息
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_shopping_cart_items')
  }
};
