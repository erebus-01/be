const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const GoogleUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const GoogleUser = mongoose.model('GoogleUser', GoogleUserSchema);

module.exports = GoogleUser;
