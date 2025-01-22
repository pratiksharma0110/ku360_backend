const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

let otpStorage = {};

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

router.post("/send-otp", (req, res) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid email address" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  otpStorage[email] = { otp, expiresAt: Date.now() + 300000 };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending OTP:", error);
      return res
        .status(500)
        .send({ success: false, message: "Error sending OTP" });
    }
    res.send({ success: true, message: "OTP sent successfully" });
  });
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res
      .status(400)
      .send({ success: false, message: "Email and OTP are required" });
  }

  const storedOtp = otpStorage[email];

  if (!storedOtp) {
    return res
      .status(400)
      .send({ success: false, message: "OTP not found for this email" });
  }

  if (storedOtp.otp === otp && storedOtp.expiresAt > Date.now()) {
    return res.send({ success: true, message: "OTP verified successfully" });
  }

  return res
    .status(400)
    .send({ success: false, message: "Invalid OTP or OTP expired" });
});

module.exports = router;
