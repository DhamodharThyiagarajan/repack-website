import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';
import repackRoutes from './routes/repackRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/repacks', repackRoutes);
app.use('/api/comments', commentRoutes);

// Health Check / Home Route
app.get('/', (req, res) => {
  res.json({ message: 'FitGirl-Repacks API is running...' });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
