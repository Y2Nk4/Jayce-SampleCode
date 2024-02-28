'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('payment_gateway_temp_info', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      cart_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_gateway_identifier: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_gateway_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      payment_record_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      grand_total: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      payment_fee: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      discounted_amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },
      charge_amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },

      payment_session_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_transaction_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('payment_gateway_temp_info')
  }
};
