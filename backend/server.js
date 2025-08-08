// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const userRoutes = require('./routes/userRoutes');
// const incidentRoutes = require('./routes/incidentRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // CORS setup for local and deployed frontend
// const allowedOrigins = [
//   'http://localhost:3000',
//   process.env.FRONTEND_URL // e.g., 'https://your-frontend.onrender.com'
// ];
// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl, etc.)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true
// }));

// app.use(express.json());

// app.use('/api/users', userRoutes);
// app.use('/api/incidents', incidentRoutes);

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000
// })
// .then(() => console.log('Connected to MongoDB Atlas'))
// .catch((err) => console.error('MongoDB connection error:', err));

// app.get('/', (req, res) => {
//   res.send('Women Safety App Backend is running');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const userRoutes = require('./routes/userRoutes');
// const incidentRoutes = require('./routes/incidentRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // CORS setup for local and deployed frontend
// const allowedOrigins = [
//   'http://localhost:3000',
//   process.env.FRONTEND_URL // e.g., 'https://your-frontend.onrender.com'
// ];
// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl, etc.)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true
// }));

// app.use(express.json());

// // Mount routers - **Note the /api prefix matches routes file usage**
// app.use('/api/users', userRoutes);
// app.use('/api/incidents', incidentRoutes);

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000
// })
// .then(() => console.log('Connected to MongoDB Atlas'))
// .catch((err) => console.error('MongoDB connection error:', err));

// app.get('/', (req, res) => {
//   res.send('Women Safety App Backend is running');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const userRoutes = require('./routes/userRoutes');
// const incidentRoutes = require('./routes/incidentRoutes');

// const app = express();
// const PORT = process.env.PORT || 4000;

// // CORS setup for local and deployed frontend
// const allowedOrigins = [
//   'http://localhost:3000',
//   process.env.FRONTEND_URL // e.g., 'https://your-frontend.onrender.com'
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

// // Mount routers - **Note the /api prefix matches routes file usage**
// app.use('/api/users', userRoutes);
// app.use('/api/incidents', incidentRoutes);

// // ----------- NOTIFICATIONS ENDPOINT -------------
// app.get('/notifications', (req, res) => {
//   // Return static sample notifications. Replace with your logic as needed.
//   const notifications = [
//     { _id: '1', title: 'Welcome to Vigilant', message: 'Thanks for joining!' },
//     { _id: '2', title: 'New Alert', message: 'You have received a new notification.' }
//   ];
//   res.json({ notifications });
// });
// // -----------------------------------------------

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000
// });
// mongoose.connection.on('connected', () => {
//   console.log('Connected to MongoDB Atlas');
// });
// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

// app.get('/', (req, res) => {
//   res.send('Women Safety App Backend is running');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


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
