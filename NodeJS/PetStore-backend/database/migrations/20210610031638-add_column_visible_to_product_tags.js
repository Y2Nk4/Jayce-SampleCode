'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('product_tags', 'visible',
      {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('product_tags', 'visible')
  }
};
