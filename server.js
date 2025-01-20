require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const authRoutes = require("./routes/auth/authRoutes.js");
const onBoardingRoutes = require("./routes/onBoardingRoute.js");
const userRoutes = require("./routes/userRoutes.js");
const noticeRoute = require("./routes/noticeRoutes.js");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

app.use("/auth", authRoutes);
app.use("/onBoarding", onBoardingRoutes);
app.use("/user", userRoutes);
app.use("/getExamNotice", noticeRoute);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

