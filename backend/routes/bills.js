const express = require('express');
const router = express.Router();
const {
  generateBills,
  getTenantBills,
  getLandlordBills,
  markBillPaid,
  getBillSummary
} = require('../controllers/billController');
const { auth, requireRole } = require('../middleware/auth');

// Landlord routes
router.post('/generate', auth, requireRole(['landlord']), generateBills);
router.get('/landlord', auth, requireRole(['landlord']), getLandlordBills);

// Rentee routes
router.get('/tenant', auth, requireRole(['rentee']), getTenantBills);
router.get('/summary', auth, requireRole(['rentee']), getBillSummary);

// Shared routes
router.put('/:billId/paid', auth, markBillPaid);

module.exports = router; 