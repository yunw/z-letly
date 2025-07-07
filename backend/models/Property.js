const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    }
  },
  rentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  tenants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  utilities: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    splitType: {
      type: String,
      enum: ['equal', 'custom'],
      default: 'equal'
    },
    customSplit: [{
      tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      }
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema); 