const cloudinary = require("../config/cloudinary");

const upload = (req, res) => {
  console.log(req);
  if (!req.file)
    return res.status(400).json({
      message: "No image uploaded",
    });
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err)
      return res.status(500).json({
        success: false,
        message: err,
      });

    return res.status(200).json({
      message: "File uploaded to cloudinary",
      url: result.url,
    });
  });
};

module.exports = upload;
