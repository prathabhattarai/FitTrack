const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { sendOTP } = require('../utils/mailer');
const { jwtSecret, nodeEnv } = require('../config/env');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const isDbConnectionError = (err) =>
  [
    'SequelizeConnectionRefusedError',
    'SequelizeConnectionError',
    'SequelizeHostNotFoundError',
    'SequelizeAccessDeniedError'
  ].includes(err?.name);

const logOtpForDev = (email, otp, purpose = 'verification') => {
  if (nodeEnv === 'production') {
    return;
  }

  console.info(`[otp:${purpose}] ${email} -> ${otp}`);
};

const sendOTPWithFallback = async (to, otp, purpose = 'verification') => {
  try {
    await sendOTP(to, otp);
    return { delivered: true };
  } catch (err) {
    // SMTP/DNS errors should not block local development account flows.
    if (nodeEnv !== 'production') {
      console.warn(`[mail] Failed to send ${purpose} OTP to ${to}:`, err?.message || err);
      return {
        delivered: false,
        otp,
        reason: err?.message || 'Email service unavailable'
      };
    }
    throw err;
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    let user;

    try {
      // Check if user exists
      user = await db.User.findOne({ where: { email } });
    } catch (err) {
      const allowDemoFallback = nodeEnv !== 'production';
      if (allowDemoFallback && isDbConnectionError(err)) {
        return res.status(201).json({
          message: 'Registration successful in demo mode (database offline).',
          demoMode: true,
          email,
        });
      }
      throw err;
    }

    if (user && user.is_verified) {
      return res.status(400).json({ message: 'Email is already registered and verified.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      // If unverified user exists, update their OTP and password
      user.password = hashedPassword;
      user.otp = otp;
      user.otp_expires_at = otpExpiresAt;
      user.name = name;
      await user.save();
    } else {
      user = await db.User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'member',
        otp,
        otp_expires_at: otpExpiresAt,
        is_verified: false
      });
    }

    logOtpForDev(user.email, otp, 'registration');

    const mailStatus = await sendOTPWithFallback(user.email, otp, 'registration');

    if (!mailStatus.delivered) {
      return res.status(201).json({
        message: 'Account created, but email service is unavailable. Use the OTP below to verify your account.',
        otp: mailStatus.otp,
        emailDelivery: false,
        emailError: mailStatus.reason
      });
    }

    res.status(201).json({ message: 'OTP sent to your email. Please verify your account to activate.' });
  } catch (err) {
    next(err);
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    let user;

    try {
      user = await db.User.findOne({ where: { email } });
    } catch (err) {
      const allowDemoFallback = nodeEnv !== 'production';
      if (allowDemoFallback && isDbConnectionError(err)) {
        return res.status(200).json({
          message: 'Account verified in demo mode (database offline). You can now login.',
          demoMode: true,
          email,
        });
      }
      throw err;
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: 'Account is already verified.' });
    }

    if (user.otp !== otp || new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Mark as verified
    user.is_verified = true;
    user.otp = null;
    user.otp_expires_at = null;
    await user.save();

    res.status(200).json({ message: 'Account verified successfully. You can now login.' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    let user;

    try {
      user = await db.User.findOne({ where: { email } });
    } catch (err) {
      const allowDemoFallback = nodeEnv !== 'production';
      const requestedRole = String(role || '').toLowerCase() === 'member' ? 'member' : 'admin';

      if (allowDemoFallback && isDbConnectionError(err)) {
        const token = jwt.sign({ id: 0, role: requestedRole }, jwtSecret, { expiresIn: '1d' });

        return res.status(200).json({
          message: 'Login successful in demo mode (database offline).',
          token,
          user: {
            id: 0,
            name: requestedRole === 'member' ? 'Member Demo' : 'Admin Demo',
            email: email || (requestedRole === 'member' ? 'member@fittrack.com' : 'admin@fittrack.com'),
            role: requestedRole
          }
        });
      }

      throw err;
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Account is not verified. Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'If that email addresses matches an account, we will send a reset code.' }); // standard security practice
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otp_expires_at = otpExpiresAt;
    await user.save();

    logOtpForDev(user.email, otp, 'password-reset');

    const mailStatus = await sendOTPWithFallback(user.email, otp, 'password reset');

    if (!mailStatus.delivered) {
      return res.status(200).json({
        message: 'Email service is unavailable. Use the reset OTP below.',
        otp: mailStatus.otp,
        emailDelivery: false,
        emailError: mailStatus.reason
      });
    }

    res.status(200).json({ message: 'If that email addresses matches an account, we will send a reset code.' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid request.' });
    }

    if (user.otp !== otp || new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otp_expires_at = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully completed. You can now login.' });
  } catch (err) {
    next(err);
  }
};
