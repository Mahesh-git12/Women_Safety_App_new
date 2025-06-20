// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your routes
const userRoutes = require('./routes/userRoutes'); // Adjust if your path is different

const app = express();
const PORT = process.env.PORT || 5000;

const incidentRoutes = require('./routes/incidentRoutes');
app.use(cors());
app.use(express.json());
app.use('/api/incidents', incidentRoutes);

// Middleware



// Register user routes
app.use('/api/users', userRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Fail fast if no primary
})

// Example route
app.get('/', (req, res) => {
  res.send('Women Safety App Backend is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





