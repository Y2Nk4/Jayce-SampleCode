export default app => {
  const Sequelize = app.Sequelize

  const UserOrderAddress = app.model.define('UserOrderAddress', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    checkout_cart_payment_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    address_type: {
      type: Sequelize.TINYINT.UNSIGNED,
      defaultValue: 0,
      comment: '0. shipping addr, 1. billing addr 2.both',
    },

    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    address1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    company: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    zip_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    tableName: 'user_order_addresses',
  })

  UserOrderAddress.associate = function () {
    app.model.UserOrderAddress.belongsTo(app.model.UserOrder, {
      as: 'order',
      foreignKey: 'order_id'
    })
    app.model.UserOrderAddress.belongsTo(app.model.CheckoutCartPayment, {
      as: 'payment',
      foreignKey: 'checkout_cart_payment_id'
    })
  }

  return UserOrderAddress
}
