'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      trainer_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Trainers', key: 'id' }, onDelete: 'CASCADE' },
      date: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};