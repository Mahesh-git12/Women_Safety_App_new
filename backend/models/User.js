
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  emergencyContacts: [{ email: String, phone: String }],
  notifications: [
    {
      message: String,
      title: String,
      fromUserId: mongoose.Schema.Types.ObjectId,
      fromUserName: String,
      fromUserEmail: String,
      location: {
        latitude: Number,
        longitude: Number
      },
      date: Date
    }
  ]
});

// 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true, required: true },
//   password: String,
//   location: {
//     type: { type: String, enum: ['Point'], default: 'Point', required: true },
//     coordinates: { type: [Number], required: true }, // [longitude, latitude]
//   },
//   emergencyContacts: [{ email: String, phone: String }],
//   notifications: [
//     {
//       message: String,
//       title: String,
//       fromUserId: mongoose.Schema.Types.ObjectId,
//       fromUserName: String,
//       fromUserEmail: String,
//       location: {
//         latitude: Number,
//         longitude: Number
//       },
//       date: Date
//     }
//   ]
// });

// userSchema.index({ location: '2dsphere' }); // <-- Crucial for geo ($nearSphere) queries!

// module.exports = mongoose.model('User', userSchema);
