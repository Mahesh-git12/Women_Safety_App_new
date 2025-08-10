// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const sendEmail = require('../utils/sendEmail');
// const User = require('../models/User');
// const Incident = require('../models/Incident');

// // Report Incident and send notifications
// router.post('/report', authMiddleware, async (req, res) => {
//   try {
//     const { location, description, latitude, longitude, contacts } = req.body;
//     const user = await User.findById(req.user.userId);

//     const incident = new Incident({
//       user: req.user.userId,
//       location,
//       description,
//       latitude,
//       longitude,
//       date: new Date(),
//       type: 'incident'
//     });
//     await incident.save();

//     // Send emails to selected contacts (if any)
//     if (Array.isArray(contacts) && contacts.length > 0) {
//       const emailPromises = contacts
//         .filter(c => c.email)
//         .map(async c => {
//           try {
//             await sendEmail({
//               to: c.email,
//               subject: `Incident Reported by ${user.name} (${user.email})`,
//               text: `Your contact ${user.name} (${user.email}) has reported an incident.Location: ${location || 'N/A'}Description: ${description || 'No details.'}Time: ${new Date().toLocaleString()}`
//             });
//             console.log('Incident email sent to', c.email);
//           } catch (err) {
//             console.error('Failed to send incident email to', c.email, err);
//           }
//         });
//       await Promise.all(emailPromises);
//     }

//     res.json({ message: 'Incident reported and contacts notified!' });
//   } catch (err) {
//     console.error('Incident report error:', err);
//     res.status(500).json({ message: 'Failed to report incident.' });
//   }
// });

// // SOS endpoint (sends emails + tracking)
// router.post('/sos', authMiddleware, async (req, res) => {
//   try {
//     const { location, description, latitude, longitude, contacts } = req.body;
//     const user = await User.findById(req.user.userId);

//     // Use selected contacts if provided, else all user's saved contacts
//     const recipients = Array.isArray(contacts) && contacts.length > 0
//       ? contacts
//       : user.emergencyContacts || [];

//     const emailRecipients = recipients.filter(c => c.email);

//     if (!emailRecipients.length) {
//       return res.status(400).json({ message: 'No emergency contacts with valid email selected.' });
//     }

//     const incident = new Incident({
//       user: req.user.userId,
//       location,
//       description: description || 'SOS Emergency!',
//       latitude,
//       longitude,
//       date: new Date(),
//       type: 'sos',
//       latestLocation: latitude && longitude ? { latitude, longitude, updatedAt: new Date() } : undefined
//     });
//     await incident.save();

//     const trackUrl = `${process.env.FRONTEND_URL}/track/${incident._id}`;

//     const emailPromises = emailRecipients.map(async c => {
//       try {
//         await sendEmail({
//           to: c.email,
//           subject: `SOS Alert from ${user.name} (${user.email})`,
//           text: `Your contact ${user.name} (${user.email}) has triggered an SOS!
// Location: ${location || 'N/A'}
// Description: ${description || 'SOS Emergency!'}
// Time: ${new Date().toLocaleString()}

// Track live location: ${trackUrl}
// `
//         });
//         console.log('SOS email sent to', c.email);
//       } catch (err) {
//         console.error('Failed to send SOS email to', c.email, err);
//       }
//     });
//     await Promise.all(emailPromises);

//     res.json({ message: 'SOS received and selected contacts notified!', incidentId: incident._id });
//   } catch (err) {
//     console.error('SOS alert error:', err);
//     res.status(500).json({ message: 'Failed to process SOS.' });
//   }
// });

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Incident = require('../models/Incident');

// Report Incident and send notifications
router.post('/report', authMiddleware, async (req, res) => {
  try {
    const { location, description, latitude, longitude, contacts } = req.body;
    const user = await User.findById(req.user.userId);

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

    if (Array.isArray(contacts) && contacts.length > 0) {
      const emailPromises = contacts
        .filter(c => c.email)
        .map(async c => {
          try {
            await sendEmail({
              to: c.email,
              subject: `Incident Reported by ${user.name} (${user.email})`,
              text: `Your contact ${user.name} (${user.email}) has reported an incident.\n\nLocation: ${location || 'N/A'}\nDescription: ${description || 'No details.'}\nTime: ${new Date().toLocaleString()}`
            });
            console.log('Incident email sent to', c.email);
          } catch (err) {
            console.error('Failed to send incident email to', c.email, err);
          }
        });
      await Promise.all(emailPromises);
    }

    res.json({ message: 'Incident reported and contacts notified!' });
  } catch (err) {
    console.error('Incident report error:', err);
    res.status(500).json({ message: 'Failed to report incident.' });
  }
});

// SOS endpoint (sends emails + tracking)
router.post('/sos', authMiddleware, async (req, res) => {
  try {
    const { location, description, latitude, longitude, contacts } = req.body;
    const user = await User.findById(req.user.userId);

    // Use selected contacts if provided, else all user's saved contacts
    const recipients = Array.isArray(contacts) && contacts.length > 0
      ? contacts
      : user.emergencyContacts || [];

    const emailRecipients = recipients.filter(c => c.email);

    if (!emailRecipients.length) {
      return res.status(400).json({ message: 'No emergency contacts with valid email selected.' });
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

    const trackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;


    const emailPromises = emailRecipients.map(async c => {
      try {
        await sendEmail({
          to: c.email,
          subject: `SOS Alert from ${user.name} (${user.email})`,
          text: `Your contact ${user.name} (${user.email}) has triggered an SOS!\n\nLocation: ${location || 'N/A'}\nDescription: ${description || 'SOS Emergency!'}\nTime: ${new Date().toLocaleString()}\n\nTrack live location: ${trackUrl}`
        });
        console.log('SOS email sent to', c.email);
      } catch (err) {
        console.error('Failed to send SOS email to', c.email, err);
      }
    });
    await Promise.all(emailPromises);

    res.json({ message: 'SOS received and selected contacts notified!', incidentId: incident._id });
  } catch (err) {
    console.error('SOS alert error:', err);
    res.status(500).json({ message: 'Failed to process SOS.' });
  }
});


// Update latest location for an incident (track live)
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

// Public endpoint to get latest live location for tracking
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

// Get all incidents for the logged-in user
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
