'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkoutVideo extends Model {
    static associate(models) {
      // Define associations if needed
    }
  }

  WorkoutVideo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    youtubeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'General'
    },
    difficulty: {
      type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
      defaultValue: 'Beginner'
    },
    duration: {
      type: DataTypes.INTEGER,
      comment: 'Duration in minutes'
    },
    targetArea: {
      type: DataTypes.STRING,
      comment: 'e.g., Chest, Back, Legs, Cardio, Core, etc.'
    },
    trainer: DataTypes.STRING,
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 5.0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'WorkoutVideo',
    tableName: 'WorkoutVideos'
  });

  return WorkoutVideo;
};
