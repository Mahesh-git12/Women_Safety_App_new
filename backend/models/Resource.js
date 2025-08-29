const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['article', 'video', 'contact'], required: true },
  content: { type: String, required: true }, // URL for videos, text for articles, contact info as needed
  description: { type: String },
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
