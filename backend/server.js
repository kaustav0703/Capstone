import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global Middlewares
app.use(cors()); // Enables cross-origin sharing for your React frontend
app.use(express.json()); // Parses incoming application/json body payloads

// Base Test Route
app.get('/', (req, res) => {
  res.send('YouTube Clone MERN Backend API is running smoothly...');
});

// App Entry Port Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening in development mode on port: ${PORT}`);
});
