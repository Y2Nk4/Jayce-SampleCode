export default app => {
  const Sequelize = app.Sequelize

  const Type = app.model.define('types', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    thumbnail: {
      type: Sequelize.STRING,
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
    tableName: 'types',
  })

  Type.associate = function() {
    app.model.Type.hasMany(app.model.Product, {
      as: 'products', foreignKey: 'type_id',
    })
  }

  return Type
}
