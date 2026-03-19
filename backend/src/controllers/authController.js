const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { sendOTP } = require('../utils/mailer');
const { jwtSecret } = require('../config/env');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    let user = await db.User.findOne({ where: { email } });
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

    await sendOTP(user.email, otp);

    res.status(201).json({ message: 'OTP sent to your email. Please verify your account to activate.' });
  } catch (err) {
    next(err);
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    const user = await db.User.findOne({ where: { email } });
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
    const { email, password } = req.body;
    
    const user = await db.User.findOne({ where: { email } });
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

    await sendOTP(user.email, otp);

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
