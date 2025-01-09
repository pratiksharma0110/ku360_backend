import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';  // Import cors package

import otpRoutes from './routes/auth/otp.js'; 
import authRoutes from './routes/auth/authRoutes.js';
import onBoardingRoutes from './routes/onBoardingRoute.js';
import userRoutes from './routes/userRoutes.js';
import noticeRoute from './routes/noticeRoutes.js';
import uploadMiddleware from './middlewares/uploadMiddleware.js';

const PORT = process.env.PORT || 5000;
const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Alternatively, specify allowed origins like this:
// const allowedOrigins = ['http://localhost:62973'];  // Add your frontend URL here
// app.use(cors({ origin: allowedOrigins }));

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
app.use('/api', otpRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
