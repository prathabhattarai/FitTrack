'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');

    if (!table.otp) {
      await queryInterface.addColumn('Users', 'otp', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!table.otp_expires_at) {
      await queryInterface.addColumn('Users', 'otp_expires_at', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }
  },

  async down (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');

    if (table.otp) {
      await queryInterface.removeColumn('Users', 'otp');
    }

    if (table.otp_expires_at) {
      await queryInterface.removeColumn('Users', 'otp_expires_at');
    }
  }
};
