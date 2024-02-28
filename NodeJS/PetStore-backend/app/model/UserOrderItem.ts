import EContentTypes from '../enum/EContentTypes'

export default app => {
  const Sequelize = app.Sequelize

  const UserOrderItem = app.model.define('UserOrderItem', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    variant_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    item_snapshot: {
      type: Sequelize.TEXT,
    },
    amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    total_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    single_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
  }, {
    freezeTableName: true,
    tableName: 'user_order_items',
  })

  UserOrderItem.associate = function () {
    app.model.UserOrderItem.addScope('defaultScope', {
      include: [
        'variant',
        'product_image',
        'variant_image'
      ]
    })

    app.model.UserOrderItem.belongsTo(app.model.UserOrder, {
      as: 'order',
      foreignKey: 'order_id'
    })
    app.model.UserOrderItem.belongsTo(app.model.ProductVariant, {
      as: 'variant',
      foreignKey: 'variant_id',
      include: [{
        model: app.model.Product,
        as: 'product',
        attributes: [ 'id', 'title' ]
      }]
    })


    // product_image
    app.model.UserOrderItem.hasMany(app.model.ProductImage.scope('singleImg'), {
      as: 'product_image',
      sourceKey: 'product_id',
      foreignKey: 'content_id',
      scope: { content_type: EContentTypes.product }
    })
    app.model.UserOrderItem.hasMany(app.model.ProductImage.scope('singleImg'), {
      as: 'variant_image',
      sourceKey: 'variant_id',
      foreignKey: 'content_id',
      scope: { content_type: EContentTypes.variant }
    })
  }

  return UserOrderItem
}
