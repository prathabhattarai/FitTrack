'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bookings', 'contacted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Bookings', 'contact_note', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Bookings', 'contact_note');
    await queryInterface.removeColumn('Bookings', 'contacted_at');
  },
};
