const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

router.get('/history', paymentController.getHistory);
router.post('/process', paymentController.processPayment);

module.exports = router;
