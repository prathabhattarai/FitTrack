const db = require('../models');

exports.checkIn = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const existing = await db.Attendance.findOne({
      where: { user_id: req.user.id, date: today }
    });

    if (existing) {
      return res.status(400).json({ message: 'Already checked in for today' });
    }

    const attendance = await db.Attendance.create({
      user_id: req.user.id,
      date: today,
      check_in_time: new Date()
    });

    res.status(201).json({ success: true, message: 'Checked in successfully', data: attendance });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const attendances = await db.Attendance.findAll({
      where: { user_id: req.user.id },
      attributes: ['id', 'user_id', 'date', 'check_in_time', 'check_out_time', 'check_in_date', 'notes', 'createdAt', 'updatedAt'],
      order: [['date', 'DESC'], ['check_in_time', 'DESC']]
    });
    res.json({ success: true, data: attendances });
  } catch (err) {
    next(err);
  }
};
