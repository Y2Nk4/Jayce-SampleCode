export default app => {
  const Sequelize = app.Sequelize
  // const { Op } = Sequelize

  const VariantStockHistory = app.model.define('VariantStockHistory', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    delta_amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    variant_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    checkout_cart_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    checkout_cart_payment_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true
    },
    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    action: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      comment: '0.人工添货 1.结算扣减 2.结算回撤增加',
    },
    // 基本时间信息
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true,
    }
  }, {
    freezeTableName: true,
    tableName: 'variant_stock_history',
  })

  VariantStockHistory.associate = function() {
    app.model.VariantStockHistory.belongsTo(app.model.CheckoutCartPayment, {
      as: 'payment', foreignKey: 'checkout_cart_payment_id'
    })
    app.model.VariantStockHistory.belongsTo(app.model.ProductVariant, { as: 'variant', foreignKey: 'variant_id' })
  }

  return VariantStockHistory
}
