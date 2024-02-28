export default app => {
  const Sequelize = app.Sequelize
  // const { Op } = Sequelize

  const CheckoutCartPayment = app.model.define('CheckoutCartPayment', {
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
    cart_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    session_id: {
      type: Sequelize.STRING,
      allowNull: false
    },

    payment_amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'unit: cent'
    },

    status: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false
    },
    gateway_status: {
      type: Sequelize.STRING
    },

    payment_gateway: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    payment_session_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    item_total: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    grand_total: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    shipping_rate: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    tax_total: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    payment_gateway_detail_id: {
      type: Sequelize.BIGINT.UNSIGNED,
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
    }
  }, {
    freezeTableName: true,
    tableName: 'checkout_cart_payment',
    scopes: {
      priceInfo: {
        attributes: [
          'id', 'payment_amount', 'item_total',
          'tax_total', 'shipping_rate', 'grand_total'
        ]
      }
    }
  })

  CheckoutCartPayment.associate = function() {
    app.model.CheckoutCartPayment.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' })
    app.model.CheckoutCartPayment.belongsTo(app.model.User.scope('simpleInfo'), {
      as: 'userSimpleInfo', foreignKey: 'user_id'
    })
    app.model.CheckoutCartPayment.hasMany(app.model.CheckoutCartItem, {
      as: 'items',
      foreignKey: 'checkout_cart_payment_id'
    })
    app.model.CheckoutCartPayment.hasMany(app.model.UserOrderDiscount, {
      as: 'discounts',
      foreignKey: 'checkout_cart_payment_id'
    })
  }

  return CheckoutCartPayment
}
