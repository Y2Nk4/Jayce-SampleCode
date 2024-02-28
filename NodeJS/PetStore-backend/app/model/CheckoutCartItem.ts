export default app => {
  const Sequelize = app.Sequelize
  // const { Op } = Sequelize

  const CheckoutCartItem = app.model.define('CheckoutCartItem', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    checkout_cart_payment_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    variant_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    total_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    single_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    cache_cart_item_id: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    tableName: 'checkout_cart_items',
  })

  CheckoutCartItem.associate = function() {
    app.model.CheckoutCartItem.belongsTo(app.model.CheckoutCartPayment, {
      as: 'payment', foreignKey: 'checkout_cart_payment_id'
    })
    app.model.CheckoutCartItem.belongsTo(app.model.ProductVariant, { as: 'variant', foreignKey: 'variant_id' })
  }

  return CheckoutCartItem
}
