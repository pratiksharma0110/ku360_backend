const express = require("express");
const authenticateUser = require("../middlewares/authenticate");
const notice = require("../utils/noticeHandler");
const router = express.Router();

//routes;
router.get("/", authenticateUser, notice.getExamNotices);
module.exports = router;
