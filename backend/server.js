// server.js
require('dotenv').config(); // Load environment variables first!

const express = require('express');
const cors = require('cors');
const financeRoutes = require('./routes/financeRoutes'); // Import the finance routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors()); // Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the frontend
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json()); // Enable parsing of JSON request bodies

// Basic route
app.get('/', (req, res) => {
    res.send('Financial Analytics Dashboard Backend is running!');
});

// Use our finance routes
app.use('/api', financeRoutes); // All finance routes will be prefixed with /api

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});