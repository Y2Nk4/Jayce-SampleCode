export default app => {
  const Sequelize = app.Sequelize

  const UserOrderDiscount = app.model.define('UserOrderDiscount', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    checkout_cart_payment_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    cart_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    order_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    discount_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },

    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    applied_amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '该折扣减少的金额',
    },
    applied_to: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      comment: '0.specific variant 1.entire order',
    },
    variant_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true
    },
    discount_type: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      comment: '0.percentage 1.fixed amount',
    },
    discount_value: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '优惠的折扣的描述值，若为percentage，则是折扣的折率，譬如九折为90.00，若为固定金额减扣，则为金额本身',
    },

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    tableName: 'user_order_discounts',
  })

  return UserOrderDiscount
}
