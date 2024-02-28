import { Op } from 'sequelize'

export default app => {
  const Sequelize = app.Sequelize
  // const { Op } = Sequelize

  const PaymentMethod = app.model.define('PaymentMethod', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    display_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    enabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    private_key: {
      type: Sequelize.STRING,
      allowNull: true
    },
    public_key: {
      type: Sequelize.STRING,
      allowNull: true
    },
    notify_key: {
      type: Sequelize.STRING,
      allowNull: true
    },
    payment_logo_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    transaction_fee: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'transaction fee, unit: 1/10k 0.01% -> 1'
    },
    discount_rate: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: 'discount fee, unit: 1/10k 100% -> 100,00'
    },
    payment_gateway: {
      type: Sequelize.STRING,
      allowNull: true
    },
    // 基本时间信息
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: true
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    tableName: 'payment_methods',
    scopes: {
      enabled: {
        where: {
          enabled: true,
          deleted_at: {
            [Op.eq]: null
          }
        }
      },
      gatewayOnly: {
        attributes: [
          'id', 'payment_gateway',
          'private_key', 'public_key', 'notify_key'
        ]
      },
      displayOnly: {
        attributes: [
          'id',
          'name',
          'display_name',
          'description',
          'enabled',
          'payment_logo_url',
          'transaction_fee',
          'discount_rate',
          'payment_gateway',
          'created_at',
          'updated_at',
          'deleted_at',
        ]
      }
    }
  })

  // PaymentMethod.associate = function() {
  // }

  return PaymentMethod
}
