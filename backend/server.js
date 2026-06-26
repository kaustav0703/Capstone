import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import channelRoutes from './routes/channelRoutes.js'; // <-- Import Channel Router

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Middlewares mounting endpoints
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/channels', channelRoutes); // <-- Mount Channel Routes

app.get('/', (req, res) => {
  res.send('YouTube Clone MERN Backend API is running smoothly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening in development mode on port: ${PORT}`);
});
