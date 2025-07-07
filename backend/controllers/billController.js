const Bill = require('../models/Bill');
const Property = require('../models/Property');
const User = require('../models/User');
const { sendNewBillNotification, sendBillPaidNotification } = require('../services/emailService');

// Generate bills for a property
const generateBills = async (req, res) => {
  try {
    const { 
      propertyId, 
      month, 
      rentAmount, 
      utilities, 
      otherFees,
      dueDate,
      rentAssignments,
      utilityAssignments,
      feeAssignments
    } = req.body;

    const property = await Property.findById(propertyId)
      .populate('tenants')
      .populate('landlord');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!property.tenants || property.tenants.length === 0) {
      return res.status(400).json({ message: 'No tenants assigned to this property' });
    }

    // Delete existing bills for this month
    await Bill.deleteMany({ property: propertyId, month });

    const bills = [];
    const billDueDate = dueDate ? new Date(dueDate) : new Date(`${month}-01`);

    // Calculate total amount (rent + utilities)
    const utilitiesTotal = utilities ? utilities.reduce((sum, util) => sum + (util.amount || 0), 0) : 0;
    const totalAmount = rentAmount + utilitiesTotal;

    // Generate total distribution bills (rent + utilities combined)
    if (totalAmount > 0) {
      if (rentAssignments && Array.isArray(rentAssignments) && rentAssignments.length > 0) {
        // Custom assignments provided for total amount
        for (const assignment of rentAssignments) {
          if (assignment.tenantId && assignment.amount && assignment.amount > 0) {
            // Calculate rent portion based on the ratio
            const rentPortion = rentAmount > 0 ? (assignment.amount * (rentAmount / totalAmount)) : 0;
            const utilitiesPortion = assignment.amount - rentPortion;
            
            // Create rent bill if there's rent
            if (rentPortion > 0) {
              const rentBill = new Bill({
                property: propertyId,
                tenant: assignment.tenantId,
                type: 'rent',
                amount: rentPortion,
                description: `Rent for ${property.name} - ${month}`,
                dueDate: billDueDate,
                month,
                splitPercentage: (assignment.amount / totalAmount) * 100,
                totalAmount: rentAmount,
                category: 'rent'
              });
              bills.push(rentBill);
            }
            
            // Create utilities bill if there are utilities
            if (utilitiesPortion > 0) {
              const utilitiesBill = new Bill({
                property: propertyId,
                tenant: assignment.tenantId,
                type: 'utility',
                amount: utilitiesPortion,
                description: `Utilities for ${property.name} - ${month}`,
                dueDate: billDueDate,
                month,
                splitPercentage: (assignment.amount / totalAmount) * 100,
                totalAmount: utilitiesTotal,
                category: 'utility',
                utilityDetails: 'Combined utilities'
              });
              bills.push(utilitiesBill);
            }
          }
        }
      } else {
        // Default equal split for total amount
        const totalPerTenant = totalAmount / property.tenants.length;
        const rentPerTenant = rentAmount > 0 ? (totalPerTenant * (rentAmount / totalAmount)) : 0;
        const utilitiesPerTenant = totalPerTenant - rentPerTenant;
        
        for (const tenant of property.tenants) {
          // Create rent bill if there's rent
          if (rentPerTenant > 0) {
            const rentBill = new Bill({
              property: propertyId,
              tenant: tenant._id,
              type: 'rent',
              amount: rentPerTenant,
              description: `Rent for ${property.name} - ${month}`,
              dueDate: billDueDate,
              month,
              splitPercentage: 100 / property.tenants.length,
              totalAmount: rentAmount,
              category: 'rent'
            });
            bills.push(rentBill);
          }
          
          // Create utilities bill if there are utilities
          if (utilitiesPerTenant > 0) {
            const utilitiesBill = new Bill({
              property: propertyId,
              tenant: tenant._id,
              type: 'utility',
              amount: utilitiesPerTenant,
              description: `Utilities for ${property.name} - ${month}`,
              dueDate: billDueDate,
              month,
              splitPercentage: 100 / property.tenants.length,
              totalAmount: utilitiesTotal,
              category: 'utility',
              utilityDetails: 'Combined utilities'
            });
            bills.push(utilitiesBill);
          }
        }
      }
    }

    // Note: Utilities are now handled in the total distribution above
    // Individual utility assignments are still supported for other fees

    // Generate other fees bills
    if (otherFees && Array.isArray(otherFees)) {
      for (const fee of otherFees) {
        if (fee.amount && fee.amount > 0) {
          // Check for custom assignments for this fee
          const feeAssignmentsForThis = feeAssignments?.find(fa => fa.feeName === fee.name);
          
          if (feeAssignmentsForThis && Array.isArray(feeAssignmentsForThis.assignments) && feeAssignmentsForThis.assignments.length > 0) {
            // Custom assignments provided for this fee
            for (const assignment of feeAssignmentsForThis.assignments) {
              if (assignment.tenantId && assignment.amount && assignment.amount > 0) {
                const otherFeeBill = new Bill({
                  property: propertyId,
                  tenant: assignment.tenantId,
                  type: 'other',
                  amount: assignment.amount,
                  description: `${fee.name} - ${property.name} - ${month}`,
                  dueDate: billDueDate,
                  month,
                  splitPercentage: (assignment.amount / fee.amount) * 100,
                  totalAmount: fee.amount,
                  category: 'other',
                  feeDetails: fee.details || fee.name
                });
                bills.push(otherFeeBill);
              }
            }
          } else {
            // Default equal split
            const feePerTenant = fee.amount / property.tenants.length;
            for (const tenant of property.tenants) {
              const otherFeeBill = new Bill({
                property: propertyId,
                tenant: tenant._id,
                type: 'other',
                amount: feePerTenant,
                description: `${fee.name} - ${property.name} - ${month}`,
                dueDate: billDueDate,
                month,
                splitPercentage: 100 / property.tenants.length,
                totalAmount: fee.amount,
                category: 'other',
                feeDetails: fee.details || fee.name
              });
              bills.push(otherFeeBill);
            }
          }
        }
      }
    }

    if (bills.length === 0) {
      return res.status(400).json({ message: 'No bills to generate. Please provide at least one bill type with amount.' });
    }

    await Bill.insertMany(bills);

    // Send email notifications to tenants
    const savedBills = await Bill.find({ property: propertyId, month }).populate('tenant', 'name email');
    
    for (const bill of savedBills) {
      if (bill.tenant && bill.tenant.email) {
        await sendNewBillNotification(
          bill.tenant.email,
          bill.tenant.name,
          property.name,
          bill.type,
          bill.amount,
          bill.dueDate
        );
      }
    }

    res.json({
      message: 'Bills generated successfully',
      bills: savedBills,
      summary: {
        totalBills: bills.length,
        totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
        rentAmount: rentAmount || 0,
        utilitiesAmount: utilities ? utilities.reduce((sum, util) => sum + (util.amount || 0), 0) : 0,
        otherFeesAmount: otherFees ? otherFees.reduce((sum, fee) => sum + (fee.amount || 0), 0) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get tenant bills
const getTenantBills = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { tenant: req.user._id };
    
    if (month) {
      query.month = month;
    }

    const bills = await Bill.find(query)
      .populate('property', 'name address')
      .sort({ dueDate: 1 });

    res.json({ bills });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get landlord bills
const getLandlordBills = async (req, res) => {
  try {
    const { propertyId, month } = req.query;
    const query = {};
    
    if (propertyId) {
      query.property = propertyId;
    }
    
    if (month) {
      query.month = month;
    }

    // Get properties owned by landlord
    const properties = await Property.find({ landlord: req.user._id });
    const propertyIds = properties.map(p => p._id);
    query.property = { $in: propertyIds };

    const bills = await Bill.find(query)
      .populate('property', 'name address')
      .populate('tenant', 'name email')
      .sort({ dueDate: 1 });

    res.json({ bills });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark bill as paid
const markBillPaid = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await Bill.findById(billId).populate('tenant', 'name email').populate('property', 'name');
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Check if user is the tenant or landlord
    const property = await Property.findById(bill.property);
    const isTenant = bill.tenant._id.toString() === req.user._id.toString();
    const isLandlord = property.landlord.toString() === req.user._id.toString();

    if (!isTenant && !isLandlord) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    bill.status = 'paid';
    bill.paidAt = new Date();
    await bill.save();

    // Send email notification to tenant
    if (bill.tenant && bill.tenant.email) {
      await sendBillPaidNotification(
        bill.tenant.email,
        bill.tenant.name,
        bill.property.name,
        bill.type,
        bill.amount
      );
    }

    res.json({
      message: 'Bill marked as paid',
      bill: bill
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get bill summary
const getBillSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { tenant: req.user._id };
    
    if (month) {
      query.month = month;
    }

    const bills = await Bill.find(query);
    
    const summary = {
      totalBills: bills.length,
      totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
      paidBills: bills.filter(bill => bill.status === 'paid').length,
      paidAmount: bills.filter(bill => bill.status === 'paid')
        .reduce((sum, bill) => sum + bill.amount, 0),
      pendingBills: bills.filter(bill => bill.status === 'pending').length,
      pendingAmount: bills.filter(bill => bill.status === 'pending')
        .reduce((sum, bill) => sum + bill.amount, 0)
    };

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateBills,
  getTenantBills,
  getLandlordBills,
  markBillPaid,
  getBillSummary
}; 