export default app => {
  const Sequelize = app.Sequelize

  const FileInfo = app.model.define('FileInfo', {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    file_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    file_path: {
      type: Sequelize.STRING,
      allowNull: false
    },
    file_md5: {
      type: Sequelize.STRING,
      allowNull: false
    },
    upload_admin_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true,
    }
  }, {
    freezeTableName: true,
    tableName: 'file_info'
  })

  return FileInfo
}
