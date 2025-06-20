const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: String,
  description: String,
  date: { type: Date, default: Date.now },
  type: { type: String, default: 'incident' }, // 'incident' or 'sos'
  latitude: Number,    // <-- add this
  longitude: Number    // <-- add this
});

module.exports = mongoose.model('Incident', incidentSchema);
