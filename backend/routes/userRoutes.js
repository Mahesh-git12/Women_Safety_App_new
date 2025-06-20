const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getEmergencyContacts,
  updateEmergencyContacts,
  getProfile,
  updateProfile
} = require('../controllers/userController');

// Registration and login routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Emergency contacts routes
router.get('/emergency-contacts', authMiddleware, getEmergencyContacts);
router.put('/emergency-contacts', authMiddleware, updateEmergencyContacts);

// User profile routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;

