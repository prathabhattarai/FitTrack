'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trainer extends Model {
    static associate(models) {
      Trainer.hasMany(models.Booking, { foreignKey: 'trainer_id', as: 'bookings' });
    }
  }
  Trainer.init({
    name: { type: DataTypes.STRING, allowNull: false },
    specialization: DataTypes.STRING,
    experience: DataTypes.INTEGER,
    hourly_rate: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'Trainer',
  });
  return Trainer;
};