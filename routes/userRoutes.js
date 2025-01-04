const express = require("express");
const authenticateUser = require("../middlewares/authenticate");
const {
  userDetails,
  editUserProfile,
} = require("../controllers/userController");
const upload = require("../controllers/uploadController");
const router = express.Router();

//routes;
router.get("/getCurrentUser", authenticateUser, userDetails);
router.post("/editProfile", authenticateUser, editUserProfile);
router.post("/upload", upload);
module.exports = router;
