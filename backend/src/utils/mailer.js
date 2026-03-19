const nodemailer = require('nodemailer');
const { email } = require('../config/env');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email.user,
    pass: email.pass
  }
});

const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: email.user,
    to,
    subject: 'Gym FitTrack - Your OTP Code',
    text: `Your OTP for verification is: ${otp}. It will expire in 10 minutes.`
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTP
};
