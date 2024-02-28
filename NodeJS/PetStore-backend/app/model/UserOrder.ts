export default app => {
  const Sequelize = app.Sequelize

  const Order = app.model.define('Order', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    status: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: true,
      comment: '0.未付款 1.已付款 2.准备中 3.已发货 4.已派送 5.取消 6.完成 7.退款',
    },
    checkout_cart_payment_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    paid_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    auto_canceled_at: {
      type: Sequelize.DATE,
      allowNull: true,
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
    tableName: 'user_orders',
  })

  Order.associate = function() {
    app.model.UserOrder.belongsTo(app.model.User, {
      as: 'user', foreignKey: 'user_id'
    })
    app.model.UserOrder.belongsTo(app.model.User.scope('simpleInfo'), {
      as: 'userSimpleInfo', foreignKey: 'user_id'
    })
    app.model.UserOrder.hasMany(app.model.UserOrderItem, {
      as: 'items', foreignKey: 'order_id'
    })
    app.model.UserOrder.hasOne(app.model.UserOrderLogistics, {
      as: 'logistics', foreignKey: 'order_id'
    })
    app.model.UserOrder.hasMany(app.model.UserOrderAddress, {
      as: 'addresses', foreignKey: 'order_id'
    })
    app.model.UserOrder.hasMany(app.model.UserOrderDiscount, {
      as: 'discounts', foreignKey: 'order_id'
    })

    app.model.UserOrder.belongsTo(
      app.model.CheckoutCartPayment.scope('priceInfo'), {
        as: 'payment', foreignKey: 'checkout_cart_payment_id'
      })

    app.model.UserOrder.belongsTo(
      app.model.CheckoutCartPayment, {
        as: 'detailPayment', foreignKey: 'checkout_cart_payment_id'
      })
    app.model.UserOrder.belongsTo(
      app.model.CheckoutCartPaymentGatewayDetail.scope('simple'), {
        as: 'paymentGatewayDetailSimple',
        foreignKey: 'checkout_cart_payment_id',
        targetKey: 'payment_record_id'
      })
    app.model.UserOrder.belongsTo(
      app.model.CheckoutCartPaymentGatewayDetail, {
        as: 'paymentGatewayDetailAll',
        foreignKey: 'checkout_cart_payment_id',
        targetKey: 'payment_record_id'
      })
  }

  return Order
}
