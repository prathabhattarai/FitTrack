const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

router.get('/profile', memberController.getProfile);
router.put('/profile', memberController.updateProfile);
router.get('/plans', memberController.getPlans);
router.post('/plans', memberController.createOrSubscribePlan);
router.post('/plans/select', memberController.selectPlan);
router.get('/my-bookings', memberController.getMyBookings);

module.exports = router;
