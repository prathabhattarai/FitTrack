const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');
const Joi = require('joi');

const trainerSchema = Joi.object({
  name: Joi.string().required(),
  specialization: Joi.string().optional(),
  experience: Joi.number().integer().optional(),
  hourly_rate: Joi.number().precision(2).optional()
});

const planSchema = Joi.object({
  name: Joi.string().required(),
  duration_months: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).min(0).required(),
  description: Joi.string().optional()
});

const adminProfileUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().allow('', null).max(30).optional(),
  address: Joi.string().allow('', null).max(255).optional(),
  department: Joi.string().allow('', null).max(120).optional(),
  avatar_url: Joi.string().uri().allow('', null).optional(),
});

const bookingStatusUpdateSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'cancelled').required(),
  note: Joi.string().trim().max(255).allow('', null).optional(),
});

const bookingContactSchema = Joi.object({
  note: Joi.string().trim().max(255).allow('', null).optional(),
});

// All admin routes need authentication and admin role
router.use(authenticate, authorizeRole('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/members', adminController.getMembers);
router.get('/members/export', adminController.exportMembersCSV);
router.get('/bookings', adminController.getTrainerBookings);
router.get('/profile', adminController.getMyProfile);
router.put('/profile', validate(adminProfileUpdateSchema), adminController.updateMyProfile);
router.patch('/bookings/:id/status', validate(bookingStatusUpdateSchema), adminController.updateTrainerBookingStatus);
router.patch('/bookings/:id/contacted', validate(bookingContactSchema), adminController.markTrainerBookingContacted);

router.post('/trainers', validate(trainerSchema), adminController.addTrainer);
router.post('/plans', validate(planSchema), adminController.addPlan);

// Admin Attendance Management Routes
router.get('/attendance', adminController.getAllAttendance);
router.get('/attendance/stats', adminController.getAttendanceStats);
router.get('/attendance/member/:memberId', adminController.getAttendanceByMember);
router.patch('/attendance/:id', adminController.updateAttendance);
router.delete('/attendance/:id', adminController.deleteAttendance);

module.exports = router;
