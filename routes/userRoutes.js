const express = require("express");
const authenticateUser = require("../middlewares/authenticate");
const { userDetails } = require("../controllers/userController");
const upload = require("../controllers/uploadController");
const router = express.Router();

//routes;
router.get("/", authenticateUser, userDetails);
router.post("/", upload);
module.exports = router;
