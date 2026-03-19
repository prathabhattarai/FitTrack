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

// All admin routes need authentication and admin role
router.use(authenticate, authorizeRole('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/members', adminController.getMembers);
router.get('/members/export', adminController.exportMembersCSV);

router.post('/trainers', validate(trainerSchema), adminController.addTrainer);
router.post('/plans', validate(planSchema), adminController.addPlan);

module.exports = router;
