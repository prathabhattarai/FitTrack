'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.MemberDetail, { foreignKey: 'user_id', as: 'memberDetail' });
      User.hasMany(models.Payment, { foreignKey: 'user_id', as: 'payments' });
      User.hasMany(models.Attendance, { foreignKey: 'user_id', as: 'attendances' });
      User.hasMany(models.Booking, { foreignKey: 'user_id', as: 'bookings' });
    }
  }
  User.init({
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'member'), defaultValue: 'member' },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    otp: { type: DataTypes.STRING },
    otp_expires_at: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};