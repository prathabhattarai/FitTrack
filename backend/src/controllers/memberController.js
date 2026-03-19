const db = require('../models');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'otp', 'otp_expires_at'] },
      include: [{
        model: db.MemberDetail,
        as: 'memberDetail',
        include: [{ model: db.MembershipPlan, as: 'activePlan' }]
      }]
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { phone, address } = req.body;
    let detail = await db.MemberDetail.findOne({ where: { user_id: req.user.id } });
    if (!detail) {
      detail = await db.MemberDetail.create({ user_id: req.user.id, phone, address });
    } else {
      detail.phone = phone || detail.phone;
      detail.address = address || detail.address;
      await detail.save();
    }
    res.json({ success: true, message: 'Profile updated', data: detail });
  } catch (err) {
    next(err);
  }
};

exports.getPlans = async (req, res, next) => {
  try {
    const plans = await db.MembershipPlan.findAll();
    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
};

exports.selectPlan = async (req, res, next) => {
  try {
    const { plan_id } = req.body;
    const plan = await db.MembershipPlan.findByPk(plan_id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    // Create a pending payment
    const payment = await db.Payment.create({
      user_id: req.user.id,
      amount: plan.price,
      status: 'pending',
      date: new Date()
    });

    // Update member detail active plan
    let detail = await db.MemberDetail.findOne({ where: { user_id: req.user.id } });
    if (!detail) {
      detail = await db.MemberDetail.create({ user_id: req.user.id, active_plan_id: plan_id, joined_date: new Date() });
    } else {
      detail.active_plan_id = plan_id;
      await detail.save();
    }

    res.json({ success: true, message: 'Plan selected. Please complete payment.', data: payment });
  } catch (err) {
    next(err);
  }
};
