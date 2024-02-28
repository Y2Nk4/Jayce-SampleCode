'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('postal_codes', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      zip_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state_abbr: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      county: {
        type: Sequelize.STRING,
        allowNull: true
      },

      // tax_rates
      // scale rate: 100000
      state_rate: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      city_rate: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      county_rate: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      special_rate: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      combined_rate: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('postal_codes')
  }
};
