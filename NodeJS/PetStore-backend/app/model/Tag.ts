export default app => {
  const Sequelize = app.Sequelize

  const Tag = app.model.define('tags', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    custom_link: {
      type: Sequelize.STRING,
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
    page_theme_color: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    tableName: 'tags',

    scopes: {
      simple: {
        attributes: [ 'id', 'name', 'custom_link', 'thumbnail' ],
      }
    },
  })

  Tag.associate = function() {
    app.model.Tag.belongsToMany(app.model.Product, {
      as: 'products', foreignKey: 'tag_id', through: 'product_tags',
    })
  }

  return Tag
}
