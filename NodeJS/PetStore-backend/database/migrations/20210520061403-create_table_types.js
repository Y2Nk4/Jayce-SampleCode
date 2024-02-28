'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('types', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      parent_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      description: {
        type: Sequelize.STRING,
        allowNull: true
      },

      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('types')
  }
};
