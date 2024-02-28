'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_images', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_link: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      content_type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      content_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_images')
  }
};
