import EContentTypes from '../enum/EContentTypes'

export default app => {
  const Sequelize = app.Sequelize

  const Product = app.model.define('Product', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    // 基本商品信息
    title: {
      type: Sequelize.STRING,
      defaultValue: 'Untitled Product',
    },
    description: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '0.草稿 1.正常 2.临时下架 3.禁止购买',
    },
    type_id: {
      type: Sequelize.BIGINT.UNSIGNED,
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
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'products',
    scopes: {
      tagSearch: {
        attributes: [ 'id' ],
      },
      idOnly: {
        attributes: [ 'id' ],
      },
      simpleInfo: {
        attributes: [ 'id', 'title', 'status' ],
      },
    },
  })

  Product.findById = function(id,
    withAssociation = false,
    filters: object = {},
    productVariant = undefined) {

    return Product.findOne({
      where: Object.assign({
        id,
      }, filters),
      include: withAssociation ?
        [{
          model: !productVariant ? app.model.ProductVariant : productVariant,
          as: 'variants',
          scope: {
            include: [],
          },
        }, {
          model: app.model.Type,
          as: 'type',
        }] : undefined,
    })
  }

  Product.associate = function() {
    app.model.Product.hasMany(app.model.ProductVariant.scope('noInclude'), {
      as: 'variants', foreignKey: 'product_id'
    })
    app.model.Product.hasMany(app.model.ProductSnapshot, { as: 'snapshots', foreignKey: 'content_id',
      scope: {
        type: EContentTypes.product,
      },
    })
    app.model.Product.hasMany(app.model.ProductImage, {
      as: 'images', foreignKey: 'content_id',
      scope: {
        content_type: EContentTypes.product,
      },
    })
    app.model.Product.hasMany(app.model.ProductImage.scope('singleImg'), {
      as: 'product_image', foreignKey: 'content_id',
      scope: {
        content_type: EContentTypes.product,
      },
    })

    app.model.Product.belongsToMany(app.model.Tag, {
      as: 'tags', foreignKey: 'product_id', through: 'product_tags',
    })
    app.model.Product.belongsToMany(app.model.Tag, {
      as: 'visibleTags', foreignKey: 'product_id', through: {
        model: 'product_tags',
        scope: {
          visible: true,
        },
      },
    })
    app.model.Product.belongsTo(app.model.Type, {
      as: 'type', foreignKey: 'type_id',
    })
  }

  return Product
}
