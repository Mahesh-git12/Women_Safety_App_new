const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Multer middleware
const {
  registerUser,
  loginUser,
  getEmergencyContacts,
  updateEmergencyContacts,
  getProfile,
  updateProfile,
  uploadAvatar // Avatar upload controller
} = require('../controllers/userController');

const User = require('../models/User');
const sendNearestUserEmailNotification = require('../utils/sendNearestUserEmail');

// Register & login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Emergency contacts and profile
router.get('/emergency-contacts', authMiddleware, getEmergencyContacts);
router.put('/emergency-contacts', authMiddleware, updateEmergencyContacts);
router.get('/profile', authMiddleware, getProfile);
// In your userRoutes.js
router.put('/profile', authMiddleware, updateProfile);


// Avatar upload route (NEW)
router.post('/profile/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

// Multi-helper support (default 3, customizable by query)
router.get('/nearest', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, limit = 3 } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude required.' });
    }

    const parsedLongitude = parseFloat(longitude);
    const parsedLatitude = parseFloat(latitude);

    console.log('Nearest search for:', {
      userId: req.user.userId,
      coordinates: [parsedLongitude, parsedLatitude]
    });

    const nearest = await User.find({
      _id: { $ne: req.user.userId },
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parsedLongitude, parsedLatitude]
          },
          $maxDistance: 20037000 // ~20,037 km
        }
      }
    })
    .select('name email location')
    .limit(Number(limit));

    if (!nearest || nearest.length === 0) {
      return res.status(404).json({ message: 'No nearby users found.' });
    }
    res.json(nearest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error searching nearest user.' });
  }
});

// Notify a helper (and optionally send email)
router.post('/notify', authMiddleware, async (req, res) => {
  try {
    const { userId, message, latitude, longitude } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID required.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Target user not found.' });

    const fromUser = await User.findById(req.user.userId);
    if (!fromUser) return res.status(404).json({ message: 'Sender not found.' });

    user.notifications.push({
      message: message || 'SOS Alert!',
      title: 'SOS Alert',
      fromUserId: fromUser._id,
      fromUserName: fromUser.name,
      fromUserEmail: fromUser.email,
      location: { latitude, longitude },
      date: new Date()
    });

    await user.save();

    // Optionally, also send email if desired
    await sendNearestUserEmailNotification(
      user.email,
      user.name,
      fromUser.name,
      fromUser.email,
      latitude,
      longitude
    );

    res.json({ message: 'Notification sent and saved with details.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending notification.' });
  }
});

// Fetch notifications for authenticated user
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ notifications: (user.notifications || []).reverse() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const {
//   registerUser,
//   loginUser,
//   getEmergencyContacts,
//   updateEmergencyContacts,
//   getProfile
// } = require('../controllers/userController');
// const User = require('../models/User');
// const sendNearestUserEmailNotification = require('../utils/sendNearestUserEmail');


// // Optionally require your email util here:
// // const sendNearestUserEmailNotification = require('../utils/sendNearestUserEmail');

// // Register & login
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// // Emergency contacts and profile
// router.get('/emergency-contacts', authMiddleware, getEmergencyContacts);
// router.put('/emergency-contacts', authMiddleware, updateEmergencyContacts);
// router.get('/profile', authMiddleware, getProfile);

// // Multi-helper support (default 3, customizable by query)
// // Multi-helper support (default 3, customizable by query)
// router.get('/nearest', authMiddleware, async (req, res) => {
//   try {
//     const { latitude, longitude, limit = 3 } = req.query;
//     if (!latitude || !longitude) {
//       return res.status(400).json({ message: 'Latitude and longitude required.' });
//     }

//     const parsedLongitude = parseFloat(longitude);
//     const parsedLatitude = parseFloat(latitude);

//     console.log('Nearest search for:', {
//       userId: req.user.userId,
//       coordinates: [parsedLongitude, parsedLatitude]
//     });

//     const nearest = await User.find({
//       _id: { $ne: req.user.userId },
//       location: {
//         $nearSphere: {
//           $geometry: {
//             type: 'Point',
//             coordinates: [parsedLongitude, parsedLatitude]
//           },
//           $maxDistance: 20037000 // ~20,037 km

//         }
//       }
//     })
//     .select('name email location')
//     .limit(Number(limit));

//     if (!nearest || nearest.length === 0) {
//       return res.status(404).json({ message: 'No nearby users found.' });
//     }
//     res.json(nearest);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error searching nearest user.' });
//   }
// });


// // Notify a helper (and optionally send email)
// router.post('/notify', authMiddleware, async (req, res) => {
//   try {
//     const { userId, message, latitude, longitude } = req.body;
//     if (!userId) return res.status(400).json({ message: 'User ID required.' });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'Target user not found.' });

//     const fromUser = await User.findById(req.user.userId);
//     if (!fromUser) return res.status(404).json({ message: 'Sender not found.' });

//     user.notifications.push({
//       message: message || 'SOS Alert!',
//       title: 'SOS Alert',
//       fromUserId: fromUser._id,
//       fromUserName: fromUser.name,
//       fromUserEmail: fromUser.email,
//       location: { latitude, longitude },
//       date: new Date()
//     });

//     await user.save();

//     // Optionally, also send email (uncomment if you've set up email integration)
//     await sendNearestUserEmailNotification(
//       user.email,
//       user.name,
//       fromUser.name,
//       fromUser.email,
//       latitude,
//       longitude
//     );
    

//     res.json({ message: 'Notification sent and saved with details.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error sending notification.' });
//   }
// });

// // Fetch notifications for authenticated user
// router.get('/notifications', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) return res.status(404).json({ message: 'User not found.' });
//     res.json({ notifications: (user.notifications || []).reverse() });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch notifications' });
//   }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const {
//   registerUser,
//   loginUser,
//   getEmergencyContacts,
//   updateEmergencyContacts,
//   getProfile
// } = require('../controllers/userController');
// const User = require('../models/User');
// const sendNearestUserEmailNotification = require('../utils/sendNearestUserEmail');


// // Optionally require your email util here:
// // const sendNearestUserEmailNotification = require('../utils/sendNearestUserEmail');

// // Register & login
// router.post('/register', registerUser);
// router.post('/login', loginUser);

// // Emergency contacts and profile
// router.get('/emergency-contacts', authMiddleware, getEmergencyContacts);
// router.put('/emergency-contacts', authMiddleware, updateEmergencyContacts);
// router.get('/profile', authMiddleware, getProfile);

// // Multi-helper support (default 3, customizable by query)
// router.get('/nearest', authMiddleware, async (req, res) => {
//   try {
//     const { latitude, longitude, limit = 3 } = req.query;
//     if (!latitude || !longitude) {
//       return res.status(400).json({ message: 'Latitude and longitude required.' });
//     }

//     // Debug: print search details to backend log
//     console.log('Nearest search for:', {
//       userId: req.user.userId,
//       longitude: longitude,
//       latitude: latitude,
//       parsed: [parseFloat(longitude), parseFloat(latitude)],
//     });

//     const nearest = await User.find({
//       _id: { $ne: req.user.userId },
//       'location.coordinates': {
//         $nearSphere: {
//           $geometry: {
//             type: 'Point',
//             coordinates: [parseFloat(longitude), parseFloat(latitude)]
//           },
//           $maxDistance: 5000 // 5km radius
//         }
//       }
//     })
//       .select('name email location')
//       .limit(Number(limit));

//     if (!nearest || nearest.length === 0) {
//       return res.status(404).json({ message: 'No nearby users found.' });
//     }
//     res.json(nearest);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error searching nearest user.' });
//   }
// });

// // Notify a helper (and optionally send email)
// router.post('/notify', authMiddleware, async (req, res) => {
//   try {
//     const { userId, message, latitude, longitude } = req.body;
//     if (!userId) return res.status(400).json({ message: 'User ID required.' });

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'Target user not found.' });

//     const fromUser = await User.findById(req.user.userId);
//     if (!fromUser) return res.status(404).json({ message: 'Sender not found.' });

//     user.notifications.push({
//       message: message || 'SOS Alert!',
//       title: 'SOS Alert',
//       fromUserId: fromUser._id,
//       fromUserName: fromUser.name,
//       fromUserEmail: fromUser.email,
//       location: { latitude, longitude },
//       date: new Date()
//     });

//     await user.save();

//     // Optionally, also send email (uncomment if you've set up email integration)
//     await sendNearestUserEmailNotification(
//       user.email,
//       user.name,
//       fromUser.name,
//       fromUser.email,
//       latitude,
//       longitude
//     );
    

//     res.json({ message: 'Notification sent and saved with details.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error sending notification.' });
//   }
// });

// // Fetch notifications for authenticated user
// router.get('/notifications', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) return res.status(404).json({ message: 'User not found.' });
//     res.json({ notifications: (user.notifications || []).reverse() });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch notifications' });
//   }
// });

// module.exports = router;

