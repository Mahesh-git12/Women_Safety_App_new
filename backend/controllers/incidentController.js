const Incident = require('../models/Incident');

exports.reportIncident = async (req, res) => {
  try {
    const { location, description } = req.body;
    const userId = req.user.userId; // Set by authMiddleware

    const incident = new Incident({
      user: userId,
      location,
      description
    });

    await incident.save();
    res.status(201).json({ message: 'Incident reported successfully', incident });
  } catch (err) {
    console.error('Report incident error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserIncidents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const incidents = await Incident.find({ user: userId }).sort({ date: -1 });
    res.json({ incidents });
  } catch (err) {
    console.error('Get incidents error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
