'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('payment_gateway_logs', 'sys_status_code', {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false
    })
    await queryInterface.addColumn('payment_gateway_logs', 'gateway_payment_method_id', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('payment_gateway_logs', 'gateway_payment_charge_id', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('payment_gateway_logs', 'sys_status_code')
    await queryInterface.removeColumn('payment_gateway_logs', 'gateway_payment_method_id')
    await queryInterface.removeColumn('payment_gateway_logs', 'gateway_payment_charge_id')
  }
};
