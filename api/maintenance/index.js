import jwt from 'jsonwebtoken';
import dbConnect from '../lib/mongodb.js';
import { MaintenanceRequest } from '../lib/models.js';

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
        return await createMaintenanceRequest(req, res, decoded);
      case 'GET':
        return await getMaintenanceRequests(req, res, decoded);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Maintenance API error:', error);
    if (error.message === 'No token provided') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Create maintenance request
async function createMaintenanceRequest(req, res, decoded) {
  const { propertyId, title, description } = req.body;

  if (!propertyId || !title || !description) {
    return res.status(400).json({ message: 'Property ID, title, and description are required' });
  }

  const maintenanceRequest = new MaintenanceRequest({
    property: propertyId,
    tenant: decoded.userId,
    title,
    description
  });

  await maintenanceRequest.save();
  res.status(201).json({ message: 'Maintenance request created successfully', maintenanceRequest });
}

// Get maintenance requests
async function getMaintenanceRequests(req, res, decoded) {
  if (decoded.role === 'landlord') {
    // Get all maintenance requests for landlord's properties
    const requests = await MaintenanceRequest.find()
      .populate('property', 'name address')
      .populate('tenant', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ requests });
  } else {
    // Get maintenance requests for the tenant
    const requests = await MaintenanceRequest.find({ tenant: decoded.userId })
      .populate('property', 'name address')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ requests });
  }
} 