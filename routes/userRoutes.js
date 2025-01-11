const express = require("express");
const authenticateUser = require("../middlewares/authenticate");
const {
  userDetails,
  editUserProfile,
  getCourses,
  getRoutine,
  checkOnboardingStatus,
  attendanceDetails,
} = require("../controllers/userController");
const upload = require("../controllers/uploadController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const router = express.Router();

//routes;
router.get("/check-onboarding", authenticateUser, checkOnboardingStatus);
router.get("/getCurrentUser", authenticateUser, userDetails);
router.get("/getAttendance", authenticateUser, attendanceDetails);
router.post("/editProfile", authenticateUser, editUserProfile);
router.get("/getCourses", getCourses);
router.get("/getRoutine", getRoutine);
router.post("/upload", authenticateUser, uploadMiddleware, upload);
module.exports = router;
