export default app => {
  const Sequelize = app.Sequelize

  return app.model.define('ProductSnapshot', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      comment: '0.product 1.variant',
      defaultValue: 0,
    },
    content_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    snapshot: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'product_snapshots',
  })
}
