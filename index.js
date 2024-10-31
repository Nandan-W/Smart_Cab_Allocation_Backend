// backend/index.js
const express = require('express');
const connectToDatabase = require('./db');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// // Connect to the database
// connectToDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// console.log("inside search route");
app.use('/api/search', searchRoutes);

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Page not found' });
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
