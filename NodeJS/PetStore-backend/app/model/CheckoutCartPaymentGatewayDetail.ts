export default app => {
  const Sequelize = app.Sequelize
  // const { Op } = Sequelize

  const CheckoutCartPaymentGatewayDetail = app.model.define('PaymentMethod', {
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
    transaction_fee: {
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
  }, {
    freezeTableName: true,
    tableName: 'checkout_cart_payment_gateway_detail',
    scopes: {
      simple: {
        attributes: [
          'id', 'payment_record_id', 'user_id',
          'charge_amount', 'payment_gateway_id',
          'grand_total', 'transaction_fee', 'discounted_amount'
        ]
      }
    }
  })

  // PaymentMethod.associate = function() {
  // }

  return CheckoutCartPaymentGatewayDetail
}
