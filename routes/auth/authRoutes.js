const express = require("express");
const router = express.Router();
const signUp = require("../../controllers/auth/signUpController");
const login = require("../../controllers/auth/loginController");
const logout = require("../../controllers/auth/logoutController");
const authenticateUser = require("../../middlewares/authenticate");
const verifyToken = require("../../controllers/auth/verify");

//routes;
router.post("/register", signUp);
router.post("/login", login);
router.get("/verify-token", authenticateUser, verifyToken);
router.get("/logout", authenticateUser, logout);
module.exports = router;
