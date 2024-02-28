'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('discounts', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      tracking_amount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      used_amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      value: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },

      discount_type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        comment: '0.percentage 1.fixed amount 2.free shipping 3.buy x get y'
      },

      maximum_applicable_time_per_order: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },

      apply_to: {
        type: Sequelize.TINYINT.UNSIGNED,
        defaultValue: 0,
        comment: '0.entire order 1.specific variant'
      },

      // requirements
      minimum_purchase_amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      maximum_usage_per_account: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      // customer requirement
      require_new_consumers: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      // free-shipping settings
      exclude_shipping_rate_over_amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },

      start_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('discounts')
  }
};
