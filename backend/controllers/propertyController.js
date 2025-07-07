const Property = require('../models/Property');
const User = require('../models/User');
const Bill = require('../models/Bill');

// Create property
const createProperty = async (req, res) => {
  try {
    const { name, address, rentAmount, utilities } = req.body;
    
    const property = new Property({
      landlord: req.user._id,
      name,
      address,
      rentAmount,
      utilities: utilities || []
    });

    await property.save();

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get landlord's properties
const getLandlordProperties = async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user._id })
      .populate('tenants', 'name email')
      .populate('utilities.customSplit.tenant', 'name email');

    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get rentee's properties
const getRenteeProperties = async (req, res) => {
  try {
    const properties = await Property.find({ tenants: req.user._id })
      .populate('landlord', 'name email')
      .populate('tenants', 'name email');

    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add tenant to property
const addTenant = async (req, res) => {
  try {
    const { propertyId, tenantEmail } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const tenant = await User.findOne({ email: tenantEmail, role: 'rentee' });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (property.tenants.includes(tenant._id)) {
      return res.status(400).json({ message: 'Tenant already added' });
    }

    property.tenants.push(tenant._id);
    await property.save();

    res.json({
      message: 'Tenant added successfully',
      property: await property.populate('tenants', 'name email')
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const updates = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(property, updates);
    await property.save();

    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove tenant from property
const removeTenant = async (req, res) => {
  try {
    const { propertyId, tenantId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if tenant exists in the property
    if (!property.tenants.includes(tenantId)) {
      return res.status(404).json({ message: 'Tenant not found in this property' });
    }

    // Remove tenant from property
    property.tenants = property.tenants.filter(tenant => tenant.toString() !== tenantId);
    await property.save();

    res.json({
      message: 'Tenant removed successfully',
      property: await property.populate('tenants', 'name email')
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProperty,
  getLandlordProperties,
  getRenteeProperties,
  addTenant,
  updateProperty,
  removeTenant
}; 