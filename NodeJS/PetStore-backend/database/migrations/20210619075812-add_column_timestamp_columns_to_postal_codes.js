'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('postal_codes', 'created_at',{
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    })
    await queryInterface.addColumn('postal_codes', 'updated_at',{
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: true
    })
    await queryInterface.addColumn('postal_codes', 'use_combined_rate',{
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('postal_codes', 'created_at')
    await queryInterface.removeColumn('postal_codes', 'updated_at')
    await queryInterface.removeColumn('postal_codes', 'use_combined_rate')
  }
};
