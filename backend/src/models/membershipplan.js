'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MembershipPlan extends Model {
    static associate(models) {
      MembershipPlan.hasMany(models.MemberDetail, { foreignKey: 'active_plan_id', as: 'members' });
    }
  }
  MembershipPlan.init({
    name: { type: DataTypes.STRING, allowNull: false },
    duration_months: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'MembershipPlan',
  });
  return MembershipPlan;
};