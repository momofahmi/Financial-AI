const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  isVerified: { type: Boolean, default: false },
  companies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  }],
});

module.exports = mongoose.model('User', userSchema);