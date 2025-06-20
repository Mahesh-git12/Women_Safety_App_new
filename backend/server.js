require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS MUST BE FIRST MIDDLEWARE
app.use(cors({
  origin: 'https://vigilant-frontend.onrender.com', // Your frontend URL
  credentials: true
}));

app.use(express.json());

// 2. Import routes AFTER CORS
const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

// 3. Apply routes AFTER CORS
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

// Connect to MongoDB (optimized)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Women Safety App Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
