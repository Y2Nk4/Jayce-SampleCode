export default app => {
  const Sequelize = app.Sequelize

  const ShippingRate = app.model.define('ShippingRate', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rate: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'shipping_rates',
  })

  ShippingRate.associate = function() {
  }

  ShippingRate.findRateById = function(id: number) {
    return ShippingRate.findOne({
      where: { id },
    })
  }

  return ShippingRate
}
