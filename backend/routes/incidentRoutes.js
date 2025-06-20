const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Incident = require('../models/Incident');

// Report Incident
router.post('/report', authMiddleware, async (req, res) => {
  try {
    const { location, description, latitude, longitude } = req.body;
    const incident = new Incident({
      user: req.user.userId,
      location,
      description,
      latitude,
      longitude,
      date: new Date(),
      type: 'incident'
    });
    await incident.save();
    res.json({ message: 'Incident reported!' });
  } catch (err) {
    console.error('Incident report error:', err);
    res.status(500).json({ message: 'Failed to report incident.' });
  }
});

// SOS endpoint
router.post('/sos', authMiddleware, async (req, res) => {
  try {
    const { location, description, latitude, longitude } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
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

    const trackUrl = `https://vigilant-frontend.onrender.com/track/${incident._id}`;

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
