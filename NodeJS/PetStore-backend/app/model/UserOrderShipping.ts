export default app => {
  const Sequelize = app.Sequelize

  const UserOrderShipping = app.model.define('UserOrderShipping', {
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
    checkout_cart_payment_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    order_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },

    shipping_rate_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },

    rate: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    tableName: 'user_order_shipping',
  })

  return UserOrderShipping
}
