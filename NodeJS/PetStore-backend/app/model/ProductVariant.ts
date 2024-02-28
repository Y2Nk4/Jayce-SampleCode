import EContentTypes from '../enum/EContentTypes'
import { Op } from 'sequelize'
import EProductVariantStatus from '../enum/EProductVariantStatus'

export default app => {
  const Sequelize = app.Sequelize

  const ProductVariant = app.model.define('product_variants', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    sku_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    barcode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_track_quantity: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    stock_quantity: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    sold_quantity: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '0.草稿 1.正常 2.缺货',
    },
    price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },
    has_discount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: false,
    },
    normal_price: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },

    // 税务信息
    is_charge_tax: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    special_tax_rate: {
      type: Sequelize.INTEGER.UNSIGNED,
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
    tableName: 'product_variants',
    scopes: {
      idOnly: {
        attributes: [ 'id' ],
      },
      simpleInfo: {
        attributes: [ 'id', 'sku_name' ]
      },
      noInclude: {},
      validVariant: {
        where: {
          status: {
            [Op.in]: [
              EProductVariantStatus.Normal,
              EProductVariantStatus.TemporaryUnavailable,
              EProductVariantStatus.ForbiddenPurchase,
            ]
          }
        }
      }
    },
  })

  ProductVariant.associate = function() {
    app.model.ProductVariant.addScope('defaultScope', {
      include: [
        {
          model: app.model.Product.scope('simpleInfo'),
          as: 'product',
        },
      ],
      where: {
        deleted_at: {
          [Op.eq]: null
        }
      }
    })
    app.model.ProductVariant.belongsTo(app.model.Product, {
      targetKey: 'id', foreignKey: 'product_id', as: 'product'
    })
    app.model.ProductVariant.hasMany(app.model.ProductImage, { as: 'images', foreignKey: 'content_id',
      scope: {
        content_type: EContentTypes.variant,
      },
    })

  }

  ProductVariant.findById = function(id, withAssociation = false, filters: Object = {}) {
    return ProductVariant.findOne({
      where: Object.assign({
        id,
      }, filters),
      include: withAssociation ?
        [{
          model: app.model.Product,
          as: 'product',
        }] : undefined,
    })
  }

  return ProductVariant
}
