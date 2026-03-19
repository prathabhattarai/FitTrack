'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists to prevent duplicate key errors on multiple runs
    const admins = await queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE email = 'admin@fittrack.com'`
    );
    
    if (admins[0].length === 0) {
      await queryInterface.bulkInsert('Users', [{
        name: 'Admin',
        email: 'admin@fittrack.com',
        password: hashedPassword,
        role: 'admin',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }

    const plans = await queryInterface.sequelize.query(
      `SELECT * FROM MembershipPlans`
    );

    if (plans[0].length === 0) {
      await queryInterface.bulkInsert('MembershipPlans', [
        {
          name: 'Basic',
          duration_months: 1,
          price: 50.00,
          description: 'Basic 1 month plan',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Premium',
          duration_months: 3,
          price: 130.00,
          description: 'Premium 3 months plan',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Annual',
          duration_months: 12,
          price: 500.00,
          description: 'Annual plan with all access',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'admin@fittrack.com' }, {});
    await queryInterface.bulkDelete('MembershipPlans', null, {});
  }
};
