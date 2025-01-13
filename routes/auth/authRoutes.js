const express = require("express");
const router = express.Router();
const signUp = require("../../controllers/auth/signUpController");
const login = require("../../controllers/auth/loginController");
const logout = require("../../controllers/auth/logoutController");
const authenticateUser = require("../../middlewares/authenticate");
const verifyToken = require("../../controllers/auth/verify");
const { sendOtp, verifyOtp } = require("../../controllers/auth/otpController");

//routes;
router.post("/register", signUp);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/verify-token", authenticateUser, verifyToken);
router.get("/logout", authenticateUser, logout);
module.exports = router;
