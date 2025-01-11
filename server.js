require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const otpRoutes = require("./routes/auth/otp.js");
const authRoutes = require("./routes/auth/authRoutes.js");
const onBoardingRoutes = require("./routes/onBoardingRoute.js");
const userRoutes = require("./routes/userRoutes.js");
const noticeRoute = require("./routes/noticeRoutes.js");

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares:
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies
app.use(cookieParser(process.env.JWT_SECRET)); // To parse cookies
app.use(fileUpload()); // To handle file uploads

// Routes
app.use("/auth", authRoutes);
app.use("/onBoarding", onBoardingRoutes);
app.use("/user", userRoutes);
app.use("/getExamNotice", noticeRoute);
app.use("/api", otpRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
