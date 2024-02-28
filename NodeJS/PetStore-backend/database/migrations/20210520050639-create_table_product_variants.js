'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      sku_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_track_quantity: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      stock_quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      status: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: '0.草稿 1.正常 2.缺货'
      },
      price: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      has_discount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      normal_price: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },

      // 税务信息
      is_charge_tax: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      special_tax_rate: {
        type: Sequelize.INTEGER.UNSIGNED,
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
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_variants')
  }
};
