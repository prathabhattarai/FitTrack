'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Attendances', 'check_in_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });
    await queryInterface.addColumn('Attendances', 'check_out_time', {
      type: Sequelize.TIME,
      allowNull: true
    });
    await queryInterface.addColumn('Attendances', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Attendances', 'check_in_date');
    await queryInterface.removeColumn('Attendances', 'check_out_time');
    await queryInterface.removeColumn('Attendances', 'notes');
  }
};
