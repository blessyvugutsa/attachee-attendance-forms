import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import attendanceRoutes from './routes/attendance.js';
// Load configuration environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors()); // Allows your React frontend to communicate with this server
app.use(express.json()); // Allows the server to read incoming JSON request bodies
app.use('/api/attendance', attendanceRoutes);
// Base Test Route
app.get('/', (req, res) => {
    res.send('Attachee Attendance Tracking API is running smoothly.');
});

// Start listening for incoming network traffic
app.listen(PORT, () => {
    console.log(`🚀 Server successfully launched on port ${PORT}`);
});