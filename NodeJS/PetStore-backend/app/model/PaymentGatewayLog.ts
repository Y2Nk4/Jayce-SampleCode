export default app => {
  const Sequelize = app.Sequelize

  const PaymentGatewayLog = app.model.define('PaymentGatewayLog', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    payment_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    payment_gateway: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false
    },

    gateway_status_code: {
      type: Sequelize.STRING,
      allowNull: true
    },
    gateway_payment_method_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    gateway_payment_charge_id: {
      type: Sequelize.STRING,
      allowNull: true
    },

    sys_status_code: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false
    },
    bank_code: {
      type: Sequelize.STRING,
      allowNull: true
    },
    payment_method_last4: {
      type: Sequelize.STRING,
      allowNull: true
    },

    log: {
      type: Sequelize.TEXT('long'),
      allowNull: true
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
    }
  }, {
    freezeTableName: true,
    tableName: 'payment_gateway_logs',
  })

  PaymentGatewayLog.associate = function() {

  }

  return PaymentGatewayLog
}
