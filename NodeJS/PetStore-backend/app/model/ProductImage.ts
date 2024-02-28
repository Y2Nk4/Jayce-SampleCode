import EContentTypes from '../enum/EContentTypes'

export default app => {
  const Sequelize = app.Sequelize

  const ProductImage = app.model.define('ProductImage', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image_link: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    content_type: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
    },
    content_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    tableName: 'product_images',
    scopes: {
      singleImg: {
        limit: 1
      }
    }
  })

  ProductImage.associate = function() {
    app.model.ProductImage.belongsTo(app.model.Product, {
      as: 'product', foreignKey: 'content_id',
      scope: { content_type: EContentTypes.product },
    })
    app.model.ProductImage.belongsTo(app.model.ProductVariant, {
      as: 'product_variant', foreignKey: 'content_id',
      scope: { content_type: EContentTypes.variant },
    })
  }

  return ProductImage
}
