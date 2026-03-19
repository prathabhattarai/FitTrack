const db = require('../models');

exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await db.Trainer.findAll();
    res.json({ success: true, data: trainers });
  } catch (err) {
    next(err);
  }
};

exports.bookTrainer = async (req, res, next) => {
  try {
    const { trainer_id, date } = req.body;
    const trainer = await db.Trainer.findByPk(trainer_id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    const booking = await db.Booking.create({
      user_id: req.user.id,
      trainer_id,
      date,
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Booking requested successfully', data: booking });
  } catch (err) {
    next(err);
  }
};
