export default app => {
  const Sequelize = app.Sequelize
  const { Op } = Sequelize

  const Discount = app.model.define('Discount', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    tracking_amount: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    used_amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    value: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'fixed amount: 100, percentage: 10000'
    },

    code: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },

    discount_type: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      comment: '0.percentage 1.fixed amount 2.free shipping 3.buy x get y',
    },

    apply_to: {
      type: Sequelize.TINYINT.UNSIGNED,
      defaultValue: 0,
      comment: '0.specific variant 1.entire order',
    },

    maximum_applicable_time_per_order: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },

    // requirements
    minimum_purchase_amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },
    maximum_usage_per_account: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },
    // customer requirement
    require_new_consumers: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // free-shipping settings
    exclude_shipping_rate_over_amount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },

    start_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    end_at: {
      type: Sequelize.DATE,
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: true,
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'discounts',
    scopes: {
      available: {
        where: {
          deleted_at: {
            [Sequelize.Op.eq]: null,
          },
        },
      },
    },
  })


  Discount.associate = function() {
    app.model.Discount.addScope('defaultScope', {
      where: {
        deleted_at: {
          [Sequelize.Op.eq]: null,
        },
      },
      include: [
        {
          model: app.model.Product.scope('idOnly'),
          as: 'products',
        },
        {
          model: app.model.ProductVariant.scope('idOnly'),
          as: 'variants',
        },
      ],
    })
    app.model.Discount.addScope('validDiscount', {
      where: {
        deleted_at: {
          [Sequelize.Op.eq]: null,
        },
        [Op.or]: [
          {
            tracking_amount: false,
          },
          {
            used_amount: { [Op.lt]: app.Sequelize.col('amount') },
          },
        ],
      },
      include: [
        {
          model: app.model.Product.scope('idOnly'),
          as: 'products',
        },
        {
          model: app.model.ProductVariant.scope('idOnly'),
          as: 'variants',
        },
      ],
    })

    app.model.Discount.belongsToMany(app.model.ProductVariant, {
      through: app.model.DiscountProductVariant,
      as: 'variants', foreignKey: 'discount_id', otherKey: 'variant_id',
    })
    app.model.Discount.belongsToMany(app.model.Product, {
      through: app.model.DiscountProductVariant,
      as: 'products', foreignKey: 'discount_id', otherKey: 'product_id',
    })
  }

  Discount.getValidDiscount = async function(code: string) {
    const Op = Sequelize.Op
    const utcDate = app.utils.utcDate.utcDate()
    return await Discount.scope('validDiscount').findOne({
      where: {
        code,
        [Op.or]: [
          {
            end_at: {
              [Op.eq]: null,
            },
          },
          {
            end_at: {
              [Op.gt]: utcDate,
            },
          },
        ],
        [Op.or]: [
          {
            start_at: {
              [Op.eq]: null,
            },
          },
          {
            start_at: {
              [Op.lt]: utcDate,
            },
          },
        ],
      },
    })
  }

  /**
   * getValidDiscountsByID
   * 如果传入了 transaction 事务 则启用悲观锁
   * */
  Discount.getValidDiscountsByID = async function(discountId: number[], transaction = null) {
    const utcDate = app.utils.utcDate.utcDate()
    return await Discount.scope('validDiscount').findAll({
      where: {
        id: { [Op.in]: discountId },
        [Op.or]: [
          {
            end_at: {
              [Op.eq]: null,
            },
          },
          {
            end_at: {
              [Op.gt]: utcDate,
            },
          },
        ],
        [Op.or]: [
          {
            start_at: {
              [Op.eq]: null,
            },
          },
          {
            start_at: {
              [Op.lt]: utcDate,
            },
          },
        ],
      },
      lock: transaction ? Sequelize.Transaction.LOCK.UPDATE : undefined,
    }, { transaction })
  }

  return Discount
}
