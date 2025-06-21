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

// SOS endpoint (returns incidentId for tracking)
router.post('/sos', authMiddleware, async (req, res) => {
  try {
    const { location, description, latitude, longitude, contacts } = req.body;
    const user = await User.findById(req.user.userId);

    // Use selected contacts if provided, else all
    const recipients = Array.isArray(contacts) && contacts.length > 0
      ? contacts
      : user.emergencyContacts || [];

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ message: 'No emergency contacts selected.' });
    }

    const incident = new Incident({
      user: req.user.userId,
      location,
      description: description || 'SOS Emergency!',
      latitude,
      longitude,
      date: new Date(),
      type: 'sos',
      latestLocation: latitude && longitude ? { latitude, longitude, updatedAt: new Date() } : undefined
    });
    await incident.save();

    const trackUrl = `https://vigilant-frontend.onrender.com/track/${incident._id}`;

    const emailPromises = recipients.map(email =>
      sendEmail({
        to: email,
        subject: `SOS Alert from ${user.name} (${user.email})`,
        text: `Your contact ${user.name} (${user.email}) has triggered an SOS!
Location: ${location}
Description: ${description || 'SOS Emergency!'}
Time: ${new Date().toLocaleString()}

Track live location: ${trackUrl}
`
      })
    );
    await Promise.all(emailPromises);

    res.json({ message: 'SOS received and selected contacts notified!', incidentId: incident._id });
  } catch (err) {
    console.error('SOS email error:', err);
    res.status(500).json({ message: 'Failed to process SOS.' });
  }
});

// Update latest location for an incident (called by the user device)
router.post('/update-location/:id', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const incident = await Incident.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { latestLocation: { latitude, longitude, updatedAt: new Date() } },
      { new: true }
    );
    if (!incident) return res.status(404).json({ message: 'Incident not found.' });
    res.json({ message: 'Location updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location.' });
  }
});

// Public endpoint to get latest location for tracking
router.get('/track-location/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident || !incident.latestLocation) {
      return res.status(404).json({ message: 'No location found.' });
    }
    res.json({ latestLocation: incident.latestLocation });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch location.' });
  }
});

// GET user's incidents
router.get('/my-incidents', authMiddleware, async (req, res) => {
  try {
    const incidents = await Incident.find({ user: req.user.userId }).sort({ date: -1 });
    res.json({ incidents });
  } catch (err) {
    console.error('Fetch incidents error:', err);
    res.status(500).json({ message: 'Failed to fetch incidents.' });
  }
});

// Delete an incident
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
