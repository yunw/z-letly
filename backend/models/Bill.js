const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['rent', 'utility', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },
  month: {
    type: String,
    required: true // Format: "YYYY-MM"
  },
  utilityName: {
    type: String,
    trim: true
  },
  splitPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  // New fields for detailed bill generation
  category: {
    type: String,
    enum: ['rent', 'utility', 'other'],
    required: true
  },
  totalAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  utilityDetails: {
    type: String,
    trim: true
  },
  feeDetails: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
billSchema.index({ property: 1, tenant: 1, month: 1 });
billSchema.index({ status: 1, dueDate: 1 });
billSchema.index({ category: 1, month: 1 });

module.exports = mongoose.model('Bill', billSchema); 