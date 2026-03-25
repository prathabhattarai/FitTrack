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

    const trainers = await queryInterface.sequelize.query(
      `SELECT id, name FROM Trainers`
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

    const existingTrainerNames = new Set(
      trainers[0].map((trainer) => String(trainer.name || '').trim().toLowerCase())
    );

    const trainerSeedRows = [
      {
        name: 'Marcus Thorne',
        specialization: 'Strength & Conditioning',
        experience: 10,
        hourly_rate: 45.00,
      },
      {
        name: 'Priya Sharma',
        specialization: 'Yoga & Flexibility',
        experience: 7,
        hourly_rate: 40.00,
      },
      {
        name: 'David Chen',
        specialization: 'Mobility & Recovery',
        experience: 8,
        hourly_rate: 50.00,
      },
      {
        name: 'Sarah Jenkins',
        specialization: 'Bodybuilding',
        experience: 3,
        hourly_rate: 42.00,
      },
      {
        name: 'Robert Iron Mike',
        specialization: 'Boxing & Self-Defense',
        experience: 12,
        hourly_rate: 55.00,
      },
      {
        name: 'Lisa Vane',
        specialization: 'Nutrition & Lifestyle',
        experience: 5,
        hourly_rate: 38.00,
      },
      {
        name: 'Chris Taylor',
        specialization: 'Calisthenics',
        experience: 4,
        hourly_rate: 40.00,
      },
      {
        name: 'Maya Patel',
        specialization: 'Pre/Post Natal Fitness',
        experience: 9,
        hourly_rate: 48.00,
      }
    ];

    const newTrainers = trainerSeedRows
      .filter((trainer) => !existingTrainerNames.has(String(trainer.name).trim().toLowerCase()))
      .map((trainer) => ({
        ...trainer,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (newTrainers.length > 0) {
      await queryInterface.bulkInsert('Trainers', newTrainers);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'admin@fittrack.com' }, {});
    await queryInterface.bulkDelete('MembershipPlans', null, {});
  }
};
