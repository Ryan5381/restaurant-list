'use strict'

const { sequelize } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'isComplete', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Restaurants', 'isComplete'
    )
  }
}
