const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

router.post('/check-in', attendanceController.checkIn);
router.get('/history', attendanceController.getHistory);

module.exports = router;
