import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['landlord', 'rentee'], required: true },
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

// Property Schema
const propertySchema = new mongoose.Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  rentAmount: { type: Number, required: true },
  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  utilities: [{
    name: String,
    amount: Number,
    splitType: { type: String, enum: ['equal', 'custom'], default: 'equal' },
    customSplit: [{
      tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      percentage: Number
    }]
  }],
  createdAt: { type: Date, default: Date.now }
});

// Bill Schema
const billSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['rent', 'utility'], required: true },
  amount: { type: Number, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  paidAt: Date,
  month: String,
  utilityName: String,
  splitPercentage: Number,
  createdAt: { type: Date, default: Date.now }
});

// Maintenance Request Schema
const maintenanceRequestSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'resolved', 'rejected'], default: 'pending' },
  landlordNotes: String,
  costAmount: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Password Reset Schema
const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Export models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
export const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);
export const MaintenanceRequest = mongoose.models.MaintenanceRequest || mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
export const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', passwordResetSchema); 