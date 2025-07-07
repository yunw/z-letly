const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequestsForLandlord,
  getRequestsForRentee,
  getRequestsForProperty,
  updateRequestStatus
} = require('../controllers/maintenanceController');
const { auth, requireRole } = require('../middleware/auth');

// Rentee submits a maintenance request
router.post('/', auth, requireRole(['rentee']), createRequest);
// Rentee views their requests
router.get('/rentee', auth, requireRole(['rentee']), getRequestsForRentee);
// Landlord views all requests for their properties
router.get('/landlord', auth, requireRole(['landlord']), getRequestsForLandlord);
// Get all requests for a property (landlord or rentee)
router.get('/property/:propertyId', auth, getRequestsForProperty);
// Landlord updates request status
router.put('/:requestId/status', auth, requireRole(['landlord']), updateRequestStatus);

module.exports = router; 