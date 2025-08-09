

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Allow CORS from frontend
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

// Sample Notifications
app.get('/notifications', (req, res) => {
  const notifications = [
    { _id: '1', title: 'Welcome to Vigilant', message: 'Thanks for joining!' },
    { _id: '2', title: 'New Alert', message: 'You have received a new notification.' }
  ];
  res.json({ notifications });
});

// ? FIXED Mongoose connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('? MongoDB Atlas connected'))
  .catch((err) => console.error('? MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Women Safety App Backend is running');
});

app.listen(PORT, () => {
  console.log(`?? Server running on port ${PORT}`);
});


// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const userRoutes = require('./routes/userRoutes');
// const incidentRoutes = require('./routes/incidentRoutes');

// const app = express();
// const PORT = process.env.PORT || 4000;

// // Allow CORS from frontend
// const allowedOrigins = [
//   'http://localhost:3000',
//   process.env.FRONTEND_URL
// ];
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true
// }));

// app.use(express.json());

// app.use('/api/users', userRoutes);
// app.use('/api/incidents', incidentRoutes);

// // Sample Notifications
// app.get('/notifications', (req, res) => {
//   const notifications = [
//     { _id: '1', title: 'Welcome to Vigilant', message: 'Thanks for joining!' },
//     { _id: '2', title: 'New Alert', message: 'You have received a new notification.' }
//   ];
//   res.json({ notifications });
// });

// // ? FIXED Mongoose connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('? MongoDB Atlas connected'))
//   .catch((err) => console.error('? MongoDB connection error:', err));

// app.get('/', (req, res) => {
//   res.send('Women Safety App Backend is running');
// });

// app.listen(PORT, () => {
//   console.log(`?? Server running on port ${PORT}`);
// });
