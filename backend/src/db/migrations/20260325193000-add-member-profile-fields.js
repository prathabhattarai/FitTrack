'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('MemberDetails', 'gender', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('MemberDetails', 'date_of_birth', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('MemberDetails', 'selected_plan', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('MemberDetails', 'selected_plan');
    await queryInterface.removeColumn('MemberDetails', 'date_of_birth');
    await queryInterface.removeColumn('MemberDetails', 'gender');
  },
};
