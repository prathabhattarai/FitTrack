'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MemberDetail extends Model {
    static associate(models) {
      MemberDetail.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      MemberDetail.belongsTo(models.MembershipPlan, { foreignKey: 'active_plan_id', as: 'activePlan' });
    }
  }
  MemberDetail.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATEONLY,
    selected_plan: DataTypes.STRING,
    joined_date: DataTypes.DATE,
    active_plan_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MemberDetail',
  });
  return MemberDetail;
};