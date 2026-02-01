const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false // For the "Two-step activation" requirement
  },
  verificationToken: String, // Stores the email activation token
  resetPasswordToken: String, // For "Forgot Password"
  resetPasswordExpire: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);