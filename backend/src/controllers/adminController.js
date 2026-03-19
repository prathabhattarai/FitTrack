const db = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalMembers = await db.User.count({ where: { role: 'member' } });
    const totalTrainers = await db.Trainer.count();
    const totalPlans = await db.MembershipPlan.count();
    const totalRevenue = await db.Payment.sum('amount', { where: { status: 'completed' } });

    res.json({
      success: true,
      data: {
        totalMembers,
        totalTrainers,
        totalPlans,
        totalRevenue: totalRevenue || 0
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const { search = '', sort = 'DESC' } = req.query;
    
    const where = {
      role: 'member',
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    };

    const members = await db.User.findAll({
      where,
      include: [{
        model: db.MemberDetail,
        as: 'memberDetail',
        include: [{ model: db.MembershipPlan, as: 'activePlan' }]
      }],
      order: [['createdAt', sort]]
    });
    
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

exports.addTrainer = async (req, res, next) => {
  try {
    const { name, specialization, experience, hourly_rate } = req.body;
    const trainer = await db.Trainer.create({ name, specialization, experience, hourly_rate });
    res.status(201).json({ success: true, message: 'Trainer added successfully', data: trainer });
  } catch (err) {
    next(err);
  }
};

exports.addPlan = async (req, res, next) => {
  try {
    const { name, duration_months, price, description } = req.body;
    const plan = await db.MembershipPlan.create({ name, duration_months, price, description });
    res.status(201).json({ success: true, message: 'Plan added successfully', data: plan });
  } catch (err) {
    next(err);
  }
};

exports.exportMembersCSV = async (req, res, next) => {
  try {
    const members = await db.User.findAll({
      where: { role: 'member' },
      include: [{ model: db.MemberDetail, as: 'memberDetail' }]
    });

    let csv = 'ID,Name,Email,Verified,Joined Date\n';
    members.forEach(m => {
      const joined = m.memberDetail ? m.memberDetail.joined_date : 'N/A';
      csv += `${m.id},${m.name},${m.email},${m.is_verified},${joined}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('members.csv');
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
