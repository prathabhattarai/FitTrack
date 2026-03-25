'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WorkoutVideos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      youtubeId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'General'
      },
      difficulty: {
        type: Sequelize.ENUM('Beginner', 'Intermediate', 'Advanced'),
        defaultValue: 'Beginner'
      },
      duration: {
        type: Sequelize.INTEGER,
        comment: 'Duration in minutes'
      },
      targetArea: {
        type: Sequelize.STRING,
        comment: 'e.g., Chest, Back, Legs, Cardio, etc.'
      },
      trainer: {
        type: Sequelize.STRING
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.DECIMAL(3, 1),
        defaultValue: 5.0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WorkoutVideos');
  }
};
