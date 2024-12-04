const express = require("express");
const authenticateUser = require("../middlewares/authenticate");
const { userDetails } = require("../controllers/userController");
const router = express.Router();

//routes;
router.get("/", authenticateUser, userDetails);
module.exports = router;
