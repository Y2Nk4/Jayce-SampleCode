'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('checkout_cart_payment', 'grand_total', 'item_total')
    await queryInterface.addColumn('checkout_cart_payment', 'grand_total', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    })

    await queryInterface.changeColumn('checkout_cart_payment', 'payment_gateway', {
      type: Sequelize.INTEGER,
      allowNull: true
    })

    await queryInterface.removeColumn('checkout_cart_payment', 'payment_transaction_id')
    await queryInterface.addColumn('checkout_cart_payment', 'payment_gateway_detail_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true
    })

    await queryInterface.addColumn('checkout_cart_payment', 'transaction_fee', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    })
    await queryInterface.addColumn('checkout_cart_payment', 'payment_discount', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.changeColumn('checkout_cart_payment', 'payment_gateway', {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true
      }, { transaction })
      await queryInterface.removeColumn('checkout_cart_payment', 'grand_total', { transaction })
      await queryInterface.removeColumn('checkout_cart_payment', 'payment_gateway_detail_id', { transaction })
      await queryInterface.renameColumn('checkout_cart_payment',
        'item_total', 'grand_total', { transaction })
      await queryInterface.addColumn('checkout_cart_payment', 'payment_transaction_id', {
        type: Sequelize.STRING,
        allowNull: true
      }, { transaction })
      await queryInterface.removeColumn('checkout_cart_payment', 'transaction_fee', { transaction })
      await queryInterface.removeColumn('checkout_cart_payment', 'payment_discount', { transaction })
      await transaction.commit()
    } catch (e) {
      await transaction.rollback()
      throw e
    }
  }
}
