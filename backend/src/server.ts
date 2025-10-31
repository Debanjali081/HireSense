import type { Express, Request, Response } from 'express';
  const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const path = require('path');
  const { fileURLToPath } = require('url');
  const http = require('http');
  const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes =require('./routes/user');
const interviewRoutes = require('./routes/interview');
const resumeRoutes = require('./routes/resume');

// Initialize Express app
const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
const passport = require('./config/passport');
app.use(passport.initialize());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hiresense';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err: any) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resumes', resumeRoutes);

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('HireSense API is running');
});

// Socket.io for real-time voice interview
io.on('connection', (socket: any) => {
  console.log('User connected:', socket.id);

  socket.on('join-interview', (interviewId: string) => {
    socket.join(interviewId);
    console.log(`User joined interview: ${interviewId}`);
  });

  socket.on('audio-data', (data: { interviewId: string, audio: ArrayBuffer }) => {
    // Mock ML analysis: simulate feedback
    const feedback = {
      tone: Math.random() > 0.5 ? 'Confident' : 'Nervous',
      speed: Math.floor(Math.random() * 100) + 50, // words per minute
      confidence: Math.floor(Math.random() * 100)
    };
    io.to(data.interviewId).emit('feedback', feedback);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
