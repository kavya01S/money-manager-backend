const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number']
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'transfer'],
    required: [true, 'Please select a type']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'], // e.g., Food, Fuel
    trim: true
  },
  division: {
    type: String,
    enum: ['Office', 'Personal'], 
    default: 'Personal'
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This gives us 'createdAt' automatically
});

module.exports = mongoose.model('Transaction', transactionSchema);