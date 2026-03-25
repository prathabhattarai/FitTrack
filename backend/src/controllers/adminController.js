const db = require('../models');
const { Op } = require('sequelize');

const demoAdminProfiles = new Map();

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

exports.getMyProfile = async (req, res, next) => {
  try {
    if (Number(req.user?.id) === 0) {
      const email = req.user?.email || 'admin@fittrack.com';
      const cached = demoAdminProfiles.get(email);

      return res.json({
        success: true,
        demoMode: true,
        data: cached || {
          id: 0,
          name: req.user?.name || 'Admin Demo',
          email,
          role: 'admin',
          phone: '',
          address: '',
          department: 'Management',
          avatar_url: '',
        }
      });
    }

    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'phone', 'address', 'department', 'avatar_url']
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin profile not found.' });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    if (Number(req.user?.id) === 0) {
      const name = String(req.body?.name || req.user?.name || '').trim();
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
      }

      const email = req.user?.email || 'admin@fittrack.com';
      const payload = {
        id: 0,
        name,
        email,
        role: 'admin',
        phone: req.body?.phone || '',
        address: req.body?.address || '',
        department: req.body?.department || 'Management',
        avatar_url: req.body?.avatar_url || '',
      };

      demoAdminProfiles.set(email, payload);

      return res.json({
        success: true,
        demoMode: true,
        message: 'Admin profile updated successfully in demo mode.',
        data: payload
      });
    }

    const user = await db.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin profile not found.' });
    }

    const updates = {
      name: (req.body.name ?? user.name),
      phone: req.body.phone ?? user.phone,
      address: req.body.address ?? user.address,
      department: req.body.department ?? user.department,
      avatar_url: req.body.avatar_url ?? user.avatar_url,
    };

    if (!String(updates.name || '').trim()) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    await user.update(updates);

    return res.json({
      success: true,
      message: 'Admin profile updated successfully.',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        department: user.department,
        avatar_url: user.avatar_url,
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getTrainerBookings = async (req, res, next) => {
  try {
    const status = String(req.query.status || '').trim().toLowerCase();
    const where = {};

    if (['pending', 'confirmed', 'cancelled'].includes(status)) {
      where.status = status;
    }

    const bookings = await db.Booking.findAll({
      where,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: db.Trainer,
          as: 'trainer',
          attributes: ['id', 'name', 'specialization']
        }
      ],
      order: [
        ['status', 'ASC'],
        ['date', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.updateTrainerBookingStatus = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    const { status, note } = req.body;

    const booking = await db.Booking.findByPk(bookingId, {
      include: [
        { model: db.User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: db.Trainer, as: 'trainer', attributes: ['id', 'name', 'specialization'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.status = status;
    if (typeof note !== 'undefined') {
      booking.contact_note = note ? String(note).trim() : null;
    }
    await booking.save();

    return res.json({
      success: true,
      message: `Booking marked as ${status}.`,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

exports.markTrainerBookingContacted = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    const { note } = req.body;

    const booking = await db.Booking.findByPk(bookingId, {
      include: [
        { model: db.User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: db.Trainer, as: 'trainer', attributes: ['id', 'name', 'specialization'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.contacted_at = new Date();
    booking.contact_note = note ? String(note).trim() : booking.contact_note;
    await booking.save();

    return res.json({
      success: true,
      message: 'Trainer contact marked successfully.',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// Admin Attendance Management
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { userId, date, month } = req.query;
    const where = {};

    if (userId) {
      where.user_id = Number(userId);
    }

    if (date) {
      where.check_in_date = date;
    }

    if (month) {
      // Filter by month (YYYY-MM format)
      const [year, monthNum] = month.split('-');
      where.check_in_date = {
        [Op.like]: `${year}-${monthNum}-%`
      };
    }

    const attendance = await db.Attendance.findAll({
      where,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['check_in_date', 'DESC'], ['check_in_time', 'DESC']]
    });

    res.json({ success: true, data: attendance });
  } catch (err) {
    next(err);
  }
};

exports.getAttendanceByMember = async (req, res, next) => {
  try {
    const memberId = Number(req.params.memberId);
    const { month, startDate, endDate } = req.query;

    const where = { user_id: memberId };

    if (month) {
      const [year, monthNum] = month.split('-');
      where.check_in_date = {
        [Op.like]: `${year}-${monthNum}-%`
      };
    } else if (startDate && endDate) {
      where.check_in_date = {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      };
    }

    const attendance = await db.Attendance.findAll({
      where,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['check_in_date', 'DESC']]
    });

    const stats = {
      total: attendance.length,
      month: month || `${startDate} to ${endDate}`,
      records: attendance
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

exports.updateAttendance = async (req, res, next) => {
  try {
    const attendanceId = Number(req.params.id);
    const { check_in_time, check_out_time, notes } = req.body;

    const attendance = await db.Attendance.findByPk(attendanceId, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    if (check_in_time) attendance.check_in_time = check_in_time;
    if (check_out_time) attendance.check_out_time = check_out_time;
    if (notes) attendance.notes = notes;

    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance record updated successfully.',
      data: attendance
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAttendance = async (req, res, next) => {
  try {
    const attendanceId = Number(req.params.id);

    const attendance = await db.Attendance.findByPk(attendanceId);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    await attendance.destroy();

    res.json({
      success: true,
      message: 'Attendance record deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

exports.getAttendanceStats = async (req, res, next) => {
  try {
    const { month } = req.query;

    const where = {};
    if (month) {
      const [year, monthNum] = month.split('-');
      where.check_in_date = {
        [Op.like]: `${year}-${monthNum}-%`
      };
    }

    const totalRecords = await db.Attendance.count({ where });
    const uniqueMembers = await db.Attendance.count({
      where,
      distinct: true,
      col: 'user_id'
    });

    const records = await db.Attendance.findAll({
      where,
      attributes: ['user_id', [db.sequelize.fn('COUNT', db.sequelize.col('user_id')), 'count']],
      group: ['user_id'],
      raw: true,
      order: [[db.sequelize.fn('COUNT', db.sequelize.col('user_id')), 'DESC']],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: {
        totalRecords,
        uniqueMembers,
        period: month || 'all-time',
        topAttendees: records
      }
    });
  } catch (err) {
    next(err);
  }
};
