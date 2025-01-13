const express = require("express");
const authenticateUser = require("../middlewares/authenticate");
const {
  search,
  userDetails,
  editUserProfile,
  getCourses,
  getChapters,
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
router.get("/getChapters", getChapters);
router.get("/getRoutine", getRoutine);
router.get("/search", search);
router.post("/upload", authenticateUser, uploadMiddleware, upload);
module.exports = router;
