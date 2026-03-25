'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Booking.belongsTo(models.Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
    }
  }
  Booking.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    trainer_id: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
    contacted_at: { type: DataTypes.DATE, allowNull: true },
    contact_note: { type: DataTypes.STRING, allowNull: true }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};