const db = require('../models');

exports.getHistory = async (req, res, next) => {
  try {
    const payments = await db.Payment.findAll({
      where: { user_id: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};

exports.processPayment = async (req, res, next) => {
  try {
    const { payment_id, transaction_id } = req.body;
    const payment = await db.Payment.findByPk(payment_id);
    
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status === 'completed') return res.status(400).json({ message: 'Payment already completed' });

    payment.status = 'completed';
    payment.transaction_id = transaction_id;
    await payment.save();

    res.json({ success: true, message: 'Payment processed successfully', data: payment });
  } catch (err) {
    next(err);
  }
};
