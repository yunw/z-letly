import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/mongodb.js';
import { Bill } from '../../lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = req.query;

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

    res.status(200).json({ 
      message: 'Bill marked as paid successfully',
      bill
    });

  } catch (error) {
    console.error('Bill payment error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
} 