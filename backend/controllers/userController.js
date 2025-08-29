const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, emergencyContacts, location } = req.body;

    if (!name || !email || !password || !location ||
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2 ||
        typeof location.coordinates[0] !== 'number' ||
        typeof location.coordinates[1] !== 'number') {
      return res.status(400).json({ message: 'All fields and valid location are required.' });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      emergencyContacts,
      location: {
        type: 'Point',
        coordinates: location.coordinates // [longitude, latitude]
      }
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // key: userId (not _id)
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getEmergencyContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ emergencyContacts: user.emergencyContacts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateEmergencyContacts = async (req, res) => {
  try {
    const { emergencyContacts } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { emergencyContacts },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Emergency contacts updated!', emergencyContacts: user.emergencyContacts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.uploadAvatar = async (req, res) => {
  try {
    console.log('File info:', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { avatarUrl },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Profile photo uploaded successfully', avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ message: 'Failed to upload avatar', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated!', user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};


// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, emergencyContacts, location } = req.body;
//     if (!name || !email || !password || !location ||
//         !location.coordinates || !Array.isArray(location.coordinates) ||
//         location.coordinates.length !== 2 ||
//         typeof location.coordinates[0] !== 'number' ||
//         typeof location.coordinates[1] !== 'number') {
//       return res.status(400).json({ message: 'All fields and valid location are required.' });
//     }
//     if (await User.findOne({ email })) {
//       return res.status(409).json({ message: 'User already exists with this email.' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       emergencyContacts,
//       location
//     });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password)))
//       return res.status(401).json({ message: 'Invalid credentials' });
//     const token = jwt.sign(
//       { userId: user._id, email: user.email }, // key: userId (not _id)
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );
//     res.json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email }
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.getEmergencyContacts = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ emergencyContacts: user.emergencyContacts });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.updateEmergencyContacts = async (req, res) => {
//   try {
//     const { emergencyContacts } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { emergencyContacts },
//       { new: true }
//     );
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ message: 'Emergency contacts updated!', emergencyContacts: user.emergencyContacts });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
