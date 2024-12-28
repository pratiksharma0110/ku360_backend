import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth/authRoutes.js';
import onBoardingRoutes from './routes/onBoardingRoute.js';
import userRoutes from './routes/userRoutes.js';
import noticeRoute from './routes/noticeRoutes.js';
import otpRoutes from './routes/otp.js'; 

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(json()); // Built-in middleware to parse JSON requests
app.use(urlencoded({ extended: false })); // Built-in middleware to parse URL-encoded data
app.use(cookieParser(process.env.JWT_SECRET)); // Parse cookies
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api', otpRoutes); // All OTP endpoints will be prefixed with /api
app.use('/auth', authRoutes);
app.use('/onBoarding', onBoardingRoutes);
app.use('/getCurrentUser', userRoutes);
app.use('/getExamNotice', noticeRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
