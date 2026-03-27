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
    const { fullName, email, phone, address, gender, dob, plan } = req.body;

    const user = await db.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (fullName !== undefined) {
      user.name = fullName;
    }
    if (email !== undefined) {
      user.email = email;
    }
    if (phone !== undefined) {
      user.phone = phone || null;
    }
    if (address !== undefined) {
      user.address = address || null;
    }
    await user.save();

    let detail = await db.MemberDetail.findOne({ where: { user_id: req.user.id } });
    if (!detail) {
      detail = await db.MemberDetail.create({
        user_id: req.user.id,
        phone: phone || null,
        address: address || null,
        gender: gender || null,
        date_of_birth: dob || null,
        selected_plan: plan || null,
      });
    } else {
      if (phone !== undefined) {
        detail.phone = phone || null;
      }
      if (address !== undefined) {
        detail.address = address || null;
      }
      if (gender !== undefined) {
        detail.gender = gender || null;
      }
      if (dob !== undefined) {
        detail.date_of_birth = dob || null;
      }
      if (plan !== undefined) {
        detail.selected_plan = plan || null;
      }
      await detail.save();
    }

    const updatedUser = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'otp', 'otp_expires_at'] },
      include: [{
        model: db.MemberDetail,
        as: 'memberDetail',
        include: [{ model: db.MembershipPlan, as: 'activePlan' }]
      }]
    });

    res.json({ success: true, message: 'Profile updated', data: updatedUser });
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

exports.createOrSubscribePlan = async (req, res, next) => {
  try {
    const { name, price, duration_months, billingCycle, category, description, features, plan_id } = req.body;
    
    // If plan_id is provided, it's a subscription to existing plan
    if (plan_id) {
      const plan = await db.MembershipPlan.findByPk(plan_id);
      if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }

      // Create payment record
      const payment = await db.Payment.create({
        user_id: req.user.id,
        amount: plan.price,
        status: 'pending',
        date: new Date()
      });

      // Update member detail with active plan
      let detail = await db.MemberDetail.findOne({ where: { user_id: req.user.id } });
      if (!detail) {
        detail = await db.MemberDetail.create({ 
          user_id: req.user.id, 
          active_plan_id: plan_id, 
          joined_date: new Date() 
        });
      } else {
        detail.active_plan_id = plan_id;
        await detail.save();
      }

      return res.json({ 
        success: true, 
        message: 'Plan subscribed successfully. Please complete payment.', 
        data: { payment, plan, memberDetail: detail } 
      });
    }
    
    // If creating a new custom plan (admin only - but keeping for compatibility)
    if (name && price !== undefined) {
      const newPlan = await db.MembershipPlan.create({
        name,
        duration_months: duration_months || 1,
        price,
        description: description || ''
      });
      
      return res.json({ 
        success: true, 
        message: 'Plan created successfully', 
        data: newPlan 
      });
    }

    return res.status(400).json({ 
      success: false, 
      message: 'Invalid request. Provide either plan_id for subscription or plan details for creation.' 
    });
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

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await db.Booking.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: db.Trainer,
        as: 'trainer',
        attributes: ['id', 'name', 'specialization', 'image_url']
      }],
      order: [['date', 'DESC']]
    });

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};
