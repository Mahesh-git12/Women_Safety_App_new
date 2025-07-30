const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  emergencyContacts: [
    {
      email: String,
      phone: String
    }
  ]
});


module.exports = mongoose.model('User', userSchema);
