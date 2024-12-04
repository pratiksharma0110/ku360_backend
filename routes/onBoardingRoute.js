const express = require("express");
const authenticateUser = require("../middlewares/authenticate");
const onBoarding = require("../controllers/onBoarding");
const router = express.Router();

//routes;
router.post("/", authenticateUser, onBoarding);
module.exports = router;
