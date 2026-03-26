const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validateMiddleware');
const authenticate = require('../middlewares/authMiddleware');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null).max(30).optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
  dob: Joi.date().iso().optional(),
  address: Joi.string().allow('', null).max(500).optional(),
  plan: Joi.string().allow('', null).max(120).optional(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'member').optional()
});

const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('Admin', 'Member', 'admin', 'member').optional()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required()
});

const changePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify-account', validate(verifySchema), authController.verifyAccount);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/change-password', validate(changePasswordSchema), authController.changePassword);

module.exports = router;
