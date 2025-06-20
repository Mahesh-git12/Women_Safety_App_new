require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup (must be before routes)
app.use(cors({
  origin: 'https://vigilant-frontend.onrender.com',
  credentials: true
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Women Safety App Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
