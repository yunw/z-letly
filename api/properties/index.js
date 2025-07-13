import jwt from 'jsonwebtoken';
import dbConnect from '../lib/mongodb.js';
import { Property, User } from '../lib/models.js';

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

    switch (req.method) {
      case 'POST':
        return await createProperty(req, res, decoded);
      case 'GET':
        return await getProperties(req, res, decoded);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Properties API error:', error);
    if (error.message === 'No token provided') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Create property (landlord only)
async function createProperty(req, res, decoded) {
  if (decoded.role !== 'landlord') {
    return res.status(403).json({ message: 'Only landlords can create properties' });
  }

  const { name, address, rentAmount, utilities } = req.body;

  if (!name || !rentAmount) {
    return res.status(400).json({ message: 'Name and rent amount are required' });
  }

  const property = new Property({
    landlord: decoded.userId,
    name,
    address,
    rentAmount: Number(rentAmount),
    utilities: utilities || []
  });

  await property.save();
  res.status(201).json({ message: 'Property created successfully', property });
}

// Get properties based on user role
async function getProperties(req, res, decoded) {
  const { role } = req.query;

  if (decoded.role === 'landlord') {
    // Get landlord's properties
    const properties = await Property.find({ landlord: decoded.userId })
      .populate('tenants', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ properties });
  } else if (decoded.role === 'rentee') {
    // Get properties where user is a tenant
    const properties = await Property.find({ tenants: decoded.userId })
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ properties });
  } else {
    res.status(403).json({ message: 'Invalid role' });
  }
} 