require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User'); // Update path if needed

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await User.deleteMany({});
    console.log('All users deleted');
    mongoose.disconnect();
  })
  .catch(console.error);
