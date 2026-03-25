'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Attendance.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    check_in_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    check_in_time: { type: DataTypes.TIME, allowNull: true },
    check_out_time: { type: DataTypes.TIME, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    date: { type: DataTypes.DATEONLY, allowNull: true }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};