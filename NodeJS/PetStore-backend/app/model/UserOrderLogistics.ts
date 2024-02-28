export default app => {
  const Sequelize = app.Sequelize

  return app.model.define('UserOrderLogistics', {
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
    order_item_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: true,
      comment: '0.未准备 1.已创建运输单 2.已发出 3.运输中 4.派送中 5.已投递 6.退回中 7.错误',
    },
    carrier: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    carrier_tracking_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tracking_result: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

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
    tableName: 'user_order_logistics',
  })
}
