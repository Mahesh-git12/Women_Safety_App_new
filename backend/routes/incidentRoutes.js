const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Incident = require('../models/Incident');

// SOS endpoint
router.post('/sos', authMiddleware, async (req, res) => {
  try {
    const { location, description, latitude, longitude } = req.body;
    const user = await User.findById(req.user.userId);

    // Check for emergency contacts
    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      return res.status(400).json({ message: 'No emergency contacts defined for this user.' });
    }

    const incident = new Incident({
      user: req.user.userId,
      location,
      description: description || 'SOS Emergency!',
      latitude,
      longitude,
      date: new Date(),
      type: 'sos'
    });
    await incident.save();

    // Use your deployed frontend URL for tracking
    const trackUrl = `https://vigilant-frontend.onrender.com/track/${incident._id}`;

    // Send email to each emergency contact
    const emailPromises = user.emergencyContacts.map(email =>
      sendEmail({
        to: email,
        subject: 'SOS Alert from Vigilant',
        text: `Your contact ${user.name} has triggered an SOS!
Location: ${location}
Description: ${description || 'SOS Emergency!'}
Time: ${new Date().toLocaleString()}

Track live location: ${trackUrl}
`
      })
    );
    await Promise.all(emailPromises);

    res.json({ message: 'SOS received and contacts notified!' });
  } catch (err) {
    console.error('SOS email error:', err);
    res.status(500).json({ message: 'Failed to process SOS.' });
  }
});

module.exports = router;
