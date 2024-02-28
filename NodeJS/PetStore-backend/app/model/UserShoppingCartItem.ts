import EContentTypes from '../enum/EContentTypes'

export default app => {
  const Sequelize = app.Sequelize

  const UserShoppingCartItem = app.model.define('UserShoppingCartItem', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    variant_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 1,
    },
    is_saved_for_later: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
    tableName: 'user_shopping_cart_items',
  })

  UserShoppingCartItem.associate = function() {
    app.model.UserShoppingCartItem.belongsTo(app.model.Product, { as: 'product', foreignKey: 'product_id' })
    app.model.UserShoppingCartItem.belongsTo(app.model.ProductVariant, { as: 'variant', foreignKey: 'variant_id' })

    // product_image
    app.model.UserShoppingCartItem.hasMany(app.model.ProductImage.scope('singleImg'), {
      as: 'product_image',
      sourceKey: 'product_id',
      foreignKey: 'content_id',
      scope: { content_type: EContentTypes.product }
    })
    app.model.UserShoppingCartItem.hasMany(app.model.ProductImage.scope('singleImg'), {
      as: 'variant_image',
      sourceKey: 'variant_id',
      foreignKey: 'content_id',
      scope: { content_type: EContentTypes.variant }
    })
  }

  UserShoppingCartItem.addToCart = function(variant, user, amount: number = 1, transaction) {
    return UserShoppingCartItem.create({
      variant_id: variant.id,
      product_id: variant.product_id,
      user_id: user.id,
      amount: amount,
    }, { transaction })
  }

  return UserShoppingCartItem
}
