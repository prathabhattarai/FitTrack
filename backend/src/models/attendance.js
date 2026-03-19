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
    check_in_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    date: { type: DataTypes.DATEONLY, allowNull: false }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};