const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Incident = require('../models/Incident');

// Regular incident report
router.post('/report', authMiddleware, async (req, res) => {
  try {
    const { location, description, latitude, longitude } = req.body;
    const incident = new Incident({
      user: req.user.userId,
      location,
      description,
      latitude,    // <-- Added
      longitude,   // <-- Added
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

    // Generate the tracking link
    const trackUrl = `http://192.168.81.140:3000/track/${incident._id}`;


    // Send email to each emergency contact
    const emailPromises = (user.emergencyContacts || []).map(email =>
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

router.get('/my-incidents', authMiddleware, async (req, res) => {
  try {
    const incidents = await Incident.find({ user: req.user.userId }).sort({ date: -1 });
    res.json({ incidents });
  } catch (err) {
    console.error('Fetch incidents error:', err);
    res.status(500).json({ message: 'Failed to fetch incidents.' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const incident = await Incident.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found or unauthorized.' });
    }
    res.json({ message: 'Incident deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete incident.' });
  }
});
module.exports = router;
