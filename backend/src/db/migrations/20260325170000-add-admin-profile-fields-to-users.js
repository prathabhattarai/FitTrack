'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');

    if (!table.phone) {
      await queryInterface.addColumn('Users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.address) {
      await queryInterface.addColumn('Users', 'address', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.department) {
      await queryInterface.addColumn('Users', 'department', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.avatar_url) {
      await queryInterface.addColumn('Users', 'avatar_url', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('Users');

    if (table.avatar_url) {
      await queryInterface.removeColumn('Users', 'avatar_url');
    }
    if (table.department) {
      await queryInterface.removeColumn('Users', 'department');
    }
    if (table.address) {
      await queryInterface.removeColumn('Users', 'address');
    }
    if (table.phone) {
      await queryInterface.removeColumn('Users', 'phone');
    }
  },
};
