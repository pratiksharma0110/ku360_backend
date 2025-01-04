require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth/authRoutes");
const onBoardingRoutes = require("./routes/onBoardingRoute");
const userRoutes = require("./routes/userRoutes");
const noticeRoute = require("./routes/noticeRoutes");
const fileUpload = require("express-fileupload");
const uploadMiddleware = require("./middlewares/uploadMiddleware");

const PORT = process.env.PORT || 5000;
const app = express();

//middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));

//routes
app.use("/auth", authRoutes);
app.use("/onBoarding", onBoardingRoutes);
app.use("/user", userRoutes);
app.use("/getExamNotice", noticeRoute);

//default route
app.get("/", (req, res) => {
  res.send("backend server");
});
//start server
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
