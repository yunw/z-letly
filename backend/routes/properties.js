const express = require('express');
const router = express.Router();
const {
  createProperty,
  getLandlordProperties,
  getRenteeProperties,
  addTenant,
  updateProperty,
  removeTenant
} = require('../controllers/propertyController');
const { auth, requireRole } = require('../middleware/auth');

// Landlord routes
router.post('/', auth, requireRole(['landlord']), createProperty);
router.get('/landlord', auth, requireRole(['landlord']), getLandlordProperties);
router.post('/add-tenant', auth, requireRole(['landlord']), addTenant);
router.put('/:propertyId', auth, requireRole(['landlord']), updateProperty);
router.delete('/:propertyId/tenants/:tenantId', auth, requireRole(['landlord']), removeTenant);

// Rentee routes
router.get('/rentee', auth, requireRole(['rentee']), getRenteeProperties);

module.exports = router; 