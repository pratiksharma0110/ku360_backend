import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const router = express.Router();

// Temporary storage for OTPs (use a database in production)
let otpStorage = {}; 

// Validate email format using a more robust regex
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Endpoint to send OTP
router.post('/send-otp', (req, res) => {
  const { email } = req.body;

  // Check if email is valid
  if (!email || !validateEmail(email)) {
    return res.status(400).send({ success: false, message: 'Invalid email address' });
  }

  // Generate a 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP with expiry (e.g., 5 minutes)
  otpStorage[email] = { otp, expiresAt: Date.now() + 300000 }; // OTP expires in 5 minutes

  // Set up email transporter using Gmail service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Ensure environment variables are loaded
      pass: process.env.EMAIL_PASS, // Ensure environment variables are loaded
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
  };

  // Send the OTP email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Error sending OTP:', error); // Log error for debugging
      return res.status(500).send({ success: false, message: 'Error sending OTP' });
    }
    res.send({ success: true, message: 'OTP sent successfully' });
  });
});

// Endpoint to verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).send({ success: false, message: 'Email and OTP are required' });
  }

  const storedOtp = otpStorage[email];

  // Check if OTP exists and is valid
  if (!storedOtp) {
    return res.status(400).send({ success: false, message: 'OTP not found for this email' });
  }

  if (storedOtp.otp === otp && storedOtp.expiresAt > Date.now()) {
    
    return res.send({ success: true, message: 'OTP verified successfully' });
  }

  return res.status(400).send({ success: false, message: 'Invalid OTP or OTP expired' });
});

export default router;
