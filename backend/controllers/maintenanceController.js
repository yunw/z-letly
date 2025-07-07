const MaintenanceRequest = require('../models/MaintenanceRequest');
const Property = require('../models/Property');
const { sendNewMaintenanceRequestNotification, sendMaintenanceUpdateNotification } = require('../services/emailService');

// Create a new maintenance request (by rentee)
const createRequest = async (req, res) => {
  try {
    const { property, title, description } = req.body;
    const rentee = req.user._id;
    // Find property and landlord
    const prop = await Property.findById(property).populate('landlord', 'name email');
    if (!prop) return res.status(404).json({ message: 'Property not found' });
    const landlord = prop.landlord;
    const request = new MaintenanceRequest({
      property,
      rentee,
      landlord,
      title,
      description
    });
    await request.save();

    // Send email notification to landlord
    if (landlord && landlord.email) {
      await sendNewMaintenanceRequestNotification(
        landlord.email,
        landlord.name,
        prop.name,
        req.user.name,
        title,
        description
      );
    }

    res.status(201).json({ message: 'Request submitted', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all requests for a landlord
const getRequestsForLandlord = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ landlord: req.user._id })
      .populate('property', 'name address')
      .populate('rentee', 'name email');
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all requests for a rentee
const getRequestsForRentee = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ rentee: req.user._id })
      .populate('property', 'name address')
      .populate('landlord', 'name email');
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all requests for a property (landlord or rentee)
const getRequestsForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const requests = await MaintenanceRequest.find({ property: propertyId })
      .populate('rentee', 'name email')
      .populate('landlord', 'name email');
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update request status and notes (landlord only)
const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, landlordNotes, costAmount } = req.body;
    
    const request = await MaintenanceRequest.findById(requestId)
      .populate('rentee', 'name email')
      .populate('property', 'name');
      
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    request.status = status;
    if (landlordNotes !== undefined) request.landlordNotes = landlordNotes;
    if (costAmount !== undefined) request.costAmount = costAmount;
    
    await request.save();

    // Send email notification to rentee
    if (request.rentee && request.rentee.email) {
      await sendMaintenanceUpdateNotification(
        request.rentee.email,
        request.rentee.name,
        request.property.name,
        request.title,
        status,
        landlordNotes,
        costAmount
      );
    }

    res.json({ message: 'Request updated', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRequest,
  getRequestsForLandlord,
  getRequestsForRentee,
  getRequestsForProperty,
  updateRequestStatus
}; 