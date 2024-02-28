'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('discount_product_variant', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      discount_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      variant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('discount_product_variant')
  }
};
