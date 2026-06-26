import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js'; // <-- Import Video Router Layout

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Middlewares mounting endpoints
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes); // <-- Mount Video Routes Endpoint Array

app.get('/', (req, res) => {
  res.send('YouTube Clone MERN Backend API is running smoothly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening in development mode on port: ${PORT}`);
});
