const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadMiddleware = multer({ storage: storage }).single("single");
module.exports = uploadMiddleware;
