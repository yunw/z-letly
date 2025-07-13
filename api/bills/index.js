import jwt from 'jsonwebtoken';
import dbConnect from '../lib/mongodb.js';
import { Bill, Property, User } from '../lib/models.js';

// Helper function to verify JWT token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default async function handler(req, res) {
  try {
    await dbConnect();
    const decoded = verifyToken(req);

    // Handle /api/bills/summary (GET)
    if (req.method === 'GET' && req.url.endsWith('/summary')) {
      // Get bills for the user
      const bills = await Bill.find({ tenant: decoded.userId });
      // Calculate summary
      const summary = {
        totalBills: bills.length,
        paidBills: bills.filter(bill => bill.status === 'paid').length,
        pendingBills: bills.filter(bill => bill.status === 'pending').length,
        overdueBills: bills.filter(bill => bill.status === 'overdue').length,
        totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
        paidAmount: bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0),
        pendingAmount: bills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0)
      };
      return res.status(200).json({ summary });
    }

    // Handle /api/bills/[id]/paid (PUT)
    const paidMatch = req.url.match(/\/([a-fA-F0-9]{24})\/paid$/);
    if (req.method === 'PUT' && paidMatch) {
      const id = paidMatch[1];
      // Find and update bill
      const bill = await Bill.findById(id);
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }
      // Check if user is the tenant of this bill
      if (bill.tenant.toString() !== decoded.userId) {
        return res.status(403).json({ message: 'Not authorized to update this bill' });
      }
      // Update bill status
      bill.status = 'paid';
      bill.paidAt = new Date();
      await bill.save();
      return res.status(200).json({ message: 'Bill marked as paid successfully', bill });
    }

    // Main bills logic
    switch (req.method) {
      case 'POST':
        return await generateBills(req, res, decoded);
      case 'GET':
        return await getBills(req, res, decoded);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Bills API error:', error);
    if (error.message === 'No token provided') {
      return res.status(401).json({ message: error.message });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Generate bills (landlord only)
async function generateBills(req, res, decoded) {
  if (decoded.role !== 'landlord') {
    return res.status(403).json({ message: 'Only landlords can generate bills' });
  }

  const { propertyId, month, rentAmount, utilities, otherFees, dueDate } = req.body;

  if (!propertyId || !month) {
    return res.status(400).json({ message: 'Property ID and month are required' });
  }

  // Get property and verify ownership
  const property = await Property.findOne({ _id: propertyId, landlord: decoded.userId })
    .populate('tenants');
  
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }

  if (!property.tenants || property.tenants.length === 0) {
    return res.status(400).json({ message: 'No tenants assigned to this property' });
  }

  const bills = [];
  const totalAmount = (rentAmount || 0) + 
    (utilities?.reduce((sum, util) => sum + (util.amount || 0), 0) || 0) +
    (otherFees?.reduce((sum, fee) => sum + (fee.amount || 0), 0) || 0);

  const amountPerTenant = totalAmount / property.tenants.length;

  // Generate bills for each tenant
  for (const tenant of property.tenants) {
    const bill = new Bill({
      property: propertyId,
      tenant: tenant._id,
      type: 'rent',
      amount: amountPerTenant,
      description: `Rent and utilities for ${month}`,
      dueDate: new Date(dueDate),
      month,
      splitPercentage: 100 / property.tenants.length
    });
    bills.push(bill);
  }

  await Bill.insertMany(bills);

  res.status(201).json({
    message: 'Bills generated successfully',
    summary: {
      totalBills: bills.length,
      totalAmount,
      amountPerTenant
    }
  });
}

// Get bills based on user role
async function getBills(req, res, decoded) {
  const { role } = req.query;

  if (decoded.role === 'landlord') {
    // Get all bills for landlord's properties
    const properties = await Property.find({ landlord: decoded.userId });
    const propertyIds = properties.map(p => p._id);
    
    const bills = await Bill.find({ property: { $in: propertyIds } })
      .populate('property', 'name')
      .populate('tenant', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ bills });
  } else if (decoded.role === 'rentee') {
    // Get bills for the tenant
    const bills = await Bill.find({ tenant: decoded.userId })
      .populate('property', 'name address')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ bills });
  } else {
    res.status(403).json({ message: 'Invalid role' });
  }
} 