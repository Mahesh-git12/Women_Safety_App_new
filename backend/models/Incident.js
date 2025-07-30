// const mongoose = require('mongoose');

// const incidentSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   location: String,
//   description: String,
//   latitude: Number,
//   longitude: Number,
//   date: { type: Date, default: Date.now },
//   type: { type: String, enum: ['incident', 'sos'], default: 'incident' },
//   latestLocation: {
//     latitude: Number,
//     longitude: Number,
//     updatedAt: Date
//   }
// });

// module.exports = mongoose.model('Incident', incidentSchema);

const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: String,
  description: String,
  latitude: Number,
  longitude: Number,
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['incident', 'sos'], default: 'incident' },
  latestLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: Date
  }
});

module.exports = mongoose.model('Incident', incidentSchema);
