export default app => {
  const Sequelize = app.Sequelize
  // const { Op } = Sequelize

  const CheckoutCartLockedItem = app.model.define('CheckoutCartLockedItem', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    variant_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    amount: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    checkout_cart_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
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
    },
  }, {
    freezeTableName: true,
    tableName: 'checkout_cart_locked_items',
  })

  CheckoutCartLockedItem.associate = function() {
    app.model.CheckoutCartLockedItem.belongsTo(app.model.ProductVariant, { as: 'variant', foreignKey: 'variant_id' })
  }

  return CheckoutCartLockedItem
}
