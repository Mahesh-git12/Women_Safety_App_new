const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getEmergencyContacts,
  updateEmergencyContacts,
  getProfile
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/emergency-contacts', authMiddleware, getEmergencyContacts);
router.put('/emergency-contacts', authMiddleware, updateEmergencyContacts);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;

