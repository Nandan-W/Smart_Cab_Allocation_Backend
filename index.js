const express = require('express');
const connectToDatabase = require('./db');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const cabRoutes = require('./routes/cab');
const userHistoryRoutes = require('./routes/userHistory');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Connect to the database
connectToDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/cab', cabRoutes);
app.use('/api/userHistory', userHistoryRoutes);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Emit updated cab data every minute
    setInterval(async () => {
        // Fetch updated cab data
        const db = await connectToDatabase();
        const availableCabs = await db.collection('cab_locations').find().toArray();
        socket.emit('updateCabs', availableCabs);
    }, 60000); // every 1 minute
});

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Page not found' });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
