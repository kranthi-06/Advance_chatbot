import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Attach io to req for real-time emitter access in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Use routes
app.use('/api', apiRoutes);

// Socket.io connection for real-time IoT dashboard
io.on('connection', (socket) => {
  console.log('New client connected: ', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chartbot_advance';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error. Please ensure MongoDB is running:', err.message);
  });

// Start server regardless of DB connection so the frontend can at least load
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
