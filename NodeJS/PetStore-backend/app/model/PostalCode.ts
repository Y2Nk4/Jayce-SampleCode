export default app => {
  const Sequelize = app.Sequelize

  const PostalCode = app.model.define('PostalCode', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    zip_code: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state_abbr: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    county: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    // tax_rates
    // scale rate: 100000
    state_rate: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },
    city_rate: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },
    county_rate: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },
    special_rate: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    },
    use_combined_rate: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    combined_rate: {
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    tableName: 'postal_codes',
  })

  PostalCode.associate = function() {
  }

  return PostalCode
}
