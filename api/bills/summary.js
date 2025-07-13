import jwt from 'jsonwebtoken';
import dbConnect from '../lib/mongodb.js';
import { Bill } from '../lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Get bills for the user
    const bills = await Bill.find({ tenant: decoded.userId });

    // Calculate summary
    const summary = {
      totalBills: bills.length,
      paidBills: bills.filter(bill => bill.status === 'paid').length,
      pendingBills: bills.filter(bill => bill.status === 'pending').length,
      overdueBills: bills.filter(bill => bill.status === 'overdue').length,
      totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
      paidAmount: bills
        .filter(bill => bill.status === 'paid')
        .reduce((sum, bill) => sum + bill.amount, 0),
      pendingAmount: bills
        .filter(bill => bill.status === 'pending')
        .reduce((sum, bill) => sum + bill.amount, 0)
    };

    res.status(200).json({ summary });

  } catch (error) {
    console.error('Bills summary error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
} 