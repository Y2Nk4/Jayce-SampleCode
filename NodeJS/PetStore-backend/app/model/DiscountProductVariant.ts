export default app => {
  const Sequelize = app.Sequelize

  const DiscountProductVariant = app.model.define('DiscountProductVariant', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    discount_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    variant_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'discount_product_variant',
  })

  return DiscountProductVariant
}
