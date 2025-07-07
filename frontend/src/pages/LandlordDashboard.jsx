import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import VideoBackground from '../components/VideoBackground';

const LandlordDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [bills, setBills] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    rentAmount: '',
    utilities: []
  });
  const [addPropertyError, setAddPropertyError] = useState("");
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [newTenant, setNewTenant] = useState({ email: '' });
  const [addTenantError, setAddTenantError] = useState("");
  const [removeTenantError, setRemoveTenantError] = useState("");
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [selectedMaintenanceRequest, setSelectedMaintenanceRequest] = useState(null);
  const [maintenanceUpdate, setMaintenanceUpdate] = useState({
    status: '',
    landlordNotes: '',
    costAmount: ''
  });
  const [maintenanceUpdateError, setMaintenanceUpdateError] = useState("");
  const [showGenerateBillsDialog, setShowGenerateBillsDialog] = useState(false);
  const [selectedPropertyForBills, setSelectedPropertyForBills] = useState(null);
  const [billFormData, setBillFormData] = useState({
    month: new Date().toISOString().slice(0, 7),
    rentAmount: '',
    utilities: [{ name: '', amount: '', details: '' }],
    otherFees: [{ name: '', amount: '', details: '' }],
    dueDate: new Date().toISOString().split('T')[0],
    rentAssignments: [],
    utilityAssignments: [],
    feeAssignments: []
  });
  const [billFormError, setBillFormError] = useState("");
  const [billFormSuccess, setBillFormSuccess] = useState("");
  const [showEditProperty, setShowEditProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState({
    name: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    rentAmount: '',
    utilities: []
  });
  const [editPropertyError, setEditPropertyError] = useState("");
  const [editPropertySuccess, setEditPropertySuccess] = useState("");

  useEffect(() => {
    fetchProperties();
    fetchBills();
    fetchMaintenanceRequests();
  }, []);

  // Update total distribution when utilities change
  useEffect(() => {
    if (showGenerateBillsDialog && selectedPropertyForBills?.tenants?.length > 0) {
      const totalAmount = getTotalAmount();
      if (totalAmount > 0) {
        const amountPerTenant = totalAmount / selectedPropertyForBills.tenants.length;
        const updatedAssignments = billFormData.rentAssignments.map(assignment => ({
          ...assignment,
          amount: amountPerTenant
        }));
        setBillFormData(prev => ({ ...prev, rentAssignments: updatedAssignments }));
      }
    }
  }, [billFormData.utilities, billFormData.rentAmount, showGenerateBillsDialog, selectedPropertyForBills]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/properties/landlord', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/bills/landlord', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBills(data.bills || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceRequests = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/maintenance/landlord', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMaintenanceRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    }
  };

  const openMaintenanceDialog = (request) => {
    setSelectedMaintenanceRequest(request);
    setMaintenanceUpdate({
      status: request.status,
      landlordNotes: request.landlordNotes || '',
      costAmount: request.costAmount || ''
    });
    setShowMaintenanceDialog(true);
  };

  const handleMaintenanceUpdate = async (e) => {
    e.preventDefault();
    setMaintenanceUpdateError("");
    try {
      const response = await fetch(`http://localhost:8080/api/maintenance/${selectedMaintenanceRequest._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: maintenanceUpdate.status,
          landlordNotes: maintenanceUpdate.landlordNotes,
          costAmount: maintenanceUpdate.costAmount ? Number(maintenanceUpdate.costAmount) : undefined
        })
      });

      if (response.ok) {
        setShowMaintenanceDialog(false);
        setSelectedMaintenanceRequest(null);
        setMaintenanceUpdate({ status: '', landlordNotes: '', costAmount: '' });
        fetchMaintenanceRequests();
      } else {
        const errorData = await response.json();
        setMaintenanceUpdateError(errorData.message || 'Failed to update request.');
      }
    } catch (error) {
      setMaintenanceUpdateError('Error updating request: ' + error.message);
      console.error('Error updating request:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setAddPropertyError("");
    try {
      const propertyToSend = {
        ...newProperty,
        rentAmount: Number(newProperty.rentAmount),
      };
      const response = await fetch('http://localhost:8080/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyToSend)
      });

      if (response.ok) {
        setShowAddProperty(false);
        setNewProperty({ name: '', address: { street: '', city: '', state: '', zipCode: '' }, rentAmount: '', utilities: [] });
        fetchProperties();
      } else {
        const errorData = await response.json();
        setAddPropertyError(errorData.message || 'Failed to add property.');
      }
    } catch (error) {
      setAddPropertyError('Error adding property: ' + error.message);
      console.error('Error adding property:', error);
    }
  };

  const handleAddTenant = async (e) => {
    e.preventDefault();
    setAddTenantError("");
    try {
      const response = await fetch('http://localhost:8080/api/properties/add-tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: selectedProperty._id,
          tenantEmail: newTenant.email
        })
      });

      if (response.ok) {
        setShowAddTenant(false);
        setNewTenant({ email: '' });
        setSelectedProperty(null);
        fetchProperties();
      } else {
        const errorData = await response.json();
        setAddTenantError(errorData.message || 'Failed to add tenant.');
      }
    } catch (error) {
      setAddTenantError('Error adding tenant: ' + error.message);
      console.error('Error adding tenant:', error);
    }
  };

  const handleRemoveTenant = async (propertyId, tenantId, tenantName) => {
    if (!window.confirm(`Are you sure you want to remove ${tenantName} from this property?`)) {
      return;
    }

    setRemoveTenantError("");
    try {
      const response = await fetch(`http://localhost:8080/api/properties/${propertyId}/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchProperties();
      } else {
        const errorData = await response.json();
        setRemoveTenantError(errorData.message || 'Failed to remove tenant.');
        setTimeout(() => setRemoveTenantError(""), 3000);
      }
    } catch (error) {
      setRemoveTenantError('Error removing tenant: ' + error.message);
      console.error('Error removing tenant:', error);
      setTimeout(() => setRemoveTenantError(""), 3000);
    }
  };

  const openAddTenantDialog = (property) => {
    setSelectedProperty(property);
    setShowAddTenant(true);
  };

  const openGenerateBillsDialog = (property) => {
    setSelectedPropertyForBills(property);
    
    // Initialize assignments for each tenant (will be updated when utilities are added)
    const initialRentAssignments = property.tenants?.map(tenant => ({
      tenantId: tenant._id,
      tenantName: tenant.name || tenant.email,
      amount: 0 // Will be calculated based on total
    })) || [];

    setBillFormData({
      month: new Date().toISOString().slice(0, 7),
      rentAmount: property.rentAmount || '',
      utilities: [{ name: '', amount: '', details: '' }],
      otherFees: [{ name: '', amount: '', details: '' }],
      dueDate: new Date().toISOString().split('T')[0],
      rentAssignments: initialRentAssignments,
      utilityAssignments: [],
      feeAssignments: []
    });
    setBillFormError("");
    setBillFormSuccess("");
    setShowGenerateBillsDialog(true);
  };

  const handleBillFormChange = (field, value, index = null) => {
    if (index !== null) {
      // Handle array fields (utilities, otherFees)
      const newArray = [...billFormData[field]];
      newArray[index] = { ...newArray[index], ...value };
      setBillFormData({ ...billFormData, [field]: newArray });
    } else {
      // Handle simple fields
      setBillFormData({ ...billFormData, [field]: value });
    }
  };

  const updateRentAssignment = (tenantId, amount) => {
    const updatedAssignments = billFormData.rentAssignments.map(assignment => 
      assignment.tenantId === tenantId 
        ? { ...assignment, amount: parseFloat(amount) || 0 }
        : assignment
    );
    setBillFormData({ ...billFormData, rentAssignments: updatedAssignments });
  };

  const updateUtilityAssignment = (utilityName, tenantId, amount) => {
    let updatedAssignments = [...billFormData.utilityAssignments];
    let utilityAssignment = updatedAssignments.find(ua => ua.utilityName === utilityName);
    
    if (!utilityAssignment) {
      utilityAssignment = { utilityName, assignments: [] };
      updatedAssignments.push(utilityAssignment);
    }
    
    const existingAssignment = utilityAssignment.assignments.find(a => a.tenantId === tenantId);
    if (existingAssignment) {
      existingAssignment.amount = parseFloat(amount) || 0;
    } else {
      utilityAssignment.assignments.push({
        tenantId,
        tenantName: selectedPropertyForBills.tenants.find(t => t._id === tenantId)?.name || '',
        amount: parseFloat(amount) || 0
      });
    }
    
    setBillFormData({ ...billFormData, utilityAssignments: updatedAssignments });
  };

  const updateFeeAssignment = (feeName, tenantId, amount) => {
    let updatedAssignments = [...billFormData.feeAssignments];
    let feeAssignment = updatedAssignments.find(fa => fa.feeName === feeName);
    
    if (!feeAssignment) {
      feeAssignment = { feeName, assignments: [] };
      updatedAssignments.push(feeAssignment);
    }
    
    const existingAssignment = feeAssignment.assignments.find(a => a.tenantId === tenantId);
    if (existingAssignment) {
      existingAssignment.amount = parseFloat(amount) || 0;
    } else {
      feeAssignment.assignments.push({
        tenantId,
        tenantName: selectedPropertyForBills.tenants.find(t => t._id === tenantId)?.name || '',
        amount: parseFloat(amount) || 0
      });
    }
    
    setBillFormData({ ...billFormData, feeAssignments: updatedAssignments });
  };

  // Note: Total calculation is now handled by useEffect

  // Get total amount for display
  const getTotalAmount = () => {
    const rentAmount = parseFloat(billFormData.rentAmount) || 0;
    const utilitiesTotal = billFormData.utilities.reduce((sum, util) => sum + (parseFloat(util.amount) || 0), 0);
    return rentAmount + utilitiesTotal;
  };

  const addUtility = () => {
    setBillFormData({
      ...billFormData,
      utilities: [...billFormData.utilities, { name: '', amount: '', details: '' }]
    });
  };

  const removeUtility = (index) => {
    const newUtilities = billFormData.utilities.filter((_, i) => i !== index);
    setBillFormData({ ...billFormData, utilities: newUtilities });
  };

  const addOtherFee = () => {
    setBillFormData({
      ...billFormData,
      otherFees: [...billFormData.otherFees, { name: '', amount: '', details: '' }]
    });
  };

  const removeOtherFee = (index) => {
    const newOtherFees = billFormData.otherFees.filter((_, i) => i !== index);
    setBillFormData({ ...billFormData, otherFees: newOtherFees });
  };

  const openEditPropertyDialog = (property) => {
    setEditingProperty({
      _id: property._id,
      name: property.name,
      address: { ...property.address },
      rentAmount: property.rentAmount.toString(),
      utilities: property.utilities || []
    });
    setEditPropertyError("");
    setEditPropertySuccess("");
    setShowEditProperty(true);
  };

  const handleEditPropertyChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditingProperty({
        ...editingProperty,
        [parent]: {
          ...editingProperty[parent],
          [child]: value
        }
      });
    } else {
      setEditingProperty({
        ...editingProperty,
        [field]: value
      });
    }
  };

  const handleEditProperty = async (e) => {
    e.preventDefault();
    setEditPropertyError("");
    setEditPropertySuccess("");
    try {
      const propertyToSend = {
        ...editingProperty,
        rentAmount: Number(editingProperty.rentAmount),
      };
      const response = await fetch(`http://localhost:8080/api/properties/${editingProperty._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyToSend)
      });

      if (response.ok) {
        setEditPropertySuccess('Property updated successfully!');
        fetchProperties();
        setTimeout(() => {
          setShowEditProperty(false);
          setEditingProperty({ name: '', address: { street: '', city: '', state: '', zipCode: '' }, rentAmount: '', utilities: [] });
          setEditPropertySuccess("");
        }, 1500);
      } else {
        const errorData = await response.json();
        setEditPropertyError(errorData.message || 'Failed to update property.');
      }
    } catch (error) {
      setEditPropertyError('Error updating property: ' + error.message);
      console.error('Error updating property:', error);
    }
  };

  const generateBills = async (e) => {
    e.preventDefault();
    setBillFormError("");
    setBillFormSuccess("");

    // Validate form data
    const hasRent = billFormData.rentAmount && parseFloat(billFormData.rentAmount) > 0;
    const hasUtilities = billFormData.utilities.some(util => util.name && parseFloat(util.amount) > 0);
    const hasOtherFees = billFormData.otherFees.some(fee => fee.name && parseFloat(fee.amount) > 0);

    if (!hasRent && !hasUtilities && !hasOtherFees) {
      setBillFormError("Please provide at least one bill type with amount.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/bills/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: selectedPropertyForBills._id,
          month: billFormData.month,
          rentAmount: parseFloat(billFormData.rentAmount) || 0,
          utilities: billFormData.utilities.filter(util => util.name && parseFloat(util.amount) > 0),
          otherFees: billFormData.otherFees.filter(fee => fee.name && parseFloat(fee.amount) > 0),
          dueDate: billFormData.dueDate,
          rentAssignments: billFormData.rentAssignments.filter(assignment => assignment.amount > 0),
          utilityAssignments: billFormData.utilityAssignments,
          feeAssignments: billFormData.feeAssignments
        })
      });

      const data = await response.json();

      if (response.ok) {
        setBillFormSuccess(`Bills generated successfully! ${data.summary.totalBills} bills created.`);
        fetchBills();
        setTimeout(() => {
          setShowGenerateBillsDialog(false);
          setBillFormSuccess("");
        }, 2000);
      } else {
        setBillFormError(data.message || 'Failed to generate bills');
      }
    } catch (error) {
      setBillFormError('Error generating bills: ' + error.message);
      console.error('Error generating bills:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6" color="primary">Loading your dashboard...</Typography>
      </Box>
    );
  }

  return (
    <VideoBackground videoSrc="/videos/landlord-bg.mp4">
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
            z-Letly - Landlord Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <Button onClick={handleLogout} color="primary" variant="outlined" size="small">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Property Management</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>Manage your properties and track bill payments</Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ my: 2 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Total Properties</Typography>
                <Typography variant="h5" fontWeight={700}>{properties.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Paid Bills</Typography>
                <Typography variant="h5" fontWeight={700}>{bills.filter(bill => bill.status === 'paid').length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Pending Bills</Typography>
                <Typography variant="h5" fontWeight={700}>{bills.filter(bill => bill.status === 'pending').length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
              onClick={() => {
                document.getElementById('maintenance-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Maintenance Requests</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {maintenanceRequests.length}
                </Typography>
                <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                  {maintenanceRequests.filter(r => r.status === 'pending').length} pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Properties Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
          <Typography variant="h6">Your Properties</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowAddProperty(true)}>
            Add Property
          </Button>
        </Box>
        {removeTenantError && (
          <Typography color="error" sx={{ mb: 2 }}>{removeTenantError}</Typography>
        )}
        {properties.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
            No properties yet. Add your first property to get started!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" fontWeight={700}>{property.name}</Typography>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openEditPropertyDialog(property)}
                        sx={{ ml: 1, mt: -0.5 }}
                        title="Edit Property"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography color="text.secondary" variant="body2">
                      {property.address.street}, {property.address.city}, {property.address.state}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
                      ${property.rentAmount}/month
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {property.tenants?.length || 0} tenant(s)
                      </Typography>
                      {property.tenants && property.tenants.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {property.tenants.map((tenant, index) => (
                            <Chip 
                              key={tenant._id || index}
                              label={tenant.name || tenant.email} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              onDelete={() => handleRemoveTenant(property._id, tenant._id, tenant.name || tenant.email)}
                              deleteIcon={<CloseIcon fontSize="small" />}
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                      onClick={() => openAddTenantDialog(property)}
                      sx={{ mr: 1 }}
                    >
                      Add Tenant
                    </Button>
                    <Button 
                      size="small" 
                      color="success" 
                      variant="contained" 
                      onClick={() => openGenerateBillsDialog(property)}
                      disabled={property.tenants?.length === 0}
                      title={property.tenants?.length === 0 ? "Add tenants first to generate bills" : "Generate detailed bills for all tenants"}
                    >
                      Generate Bills
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Bills Section */}
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>Recent Bills</Typography>
          {bills.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
              No bills generated yet. Generate bills for your properties to see them here.
            </Typography>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Tenant</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill._id}>
                      <TableCell>{bill.property?.name}</TableCell>
                      <TableCell>{bill.tenant?.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={bill.type.charAt(0).toUpperCase() + bill.type.slice(1)} 
                          color={bill.type === 'rent' ? 'primary' : bill.type === 'utility' ? 'info' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {bill.description}
                          </Typography>
                          {bill.utilityDetails && (
                            <Typography variant="caption" color="text.secondary">
                              {bill.utilityDetails}
                            </Typography>
                          )}
                          {bill.feeDetails && (
                            <Typography variant="caption" color="text.secondary">
                              {bill.feeDetails}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            ${bill.amount}
                          </Typography>
                          {bill.totalAmount && bill.totalAmount !== bill.amount && (
                            <Typography variant="caption" color="text.secondary">
                              Split from ${bill.totalAmount}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            color: bill.status === 'paid' ? 'success.main' : bill.status === 'pending' ? 'warning.main' : 'error.main',
                            bgcolor: bill.status === 'paid' ? 'success.light' : bill.status === 'pending' ? 'warning.light' : 'error.light',
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          {bill.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>

        {/* Maintenance Requests Section */}
        <Box mt={6} id="maintenance-section">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Maintenance Requests</Typography>
            <Typography variant="body2" color="text.secondary">
              {maintenanceRequests.filter(r => r.status === 'pending').length} pending
            </Typography>
          </Box>
          {maintenanceRequests.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
              No maintenance requests yet. Requests from your tenants will appear here.
            </Typography>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Tenant</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Notes/Cost</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {request.title}
                        </Typography>
                      </TableCell>
                      <TableCell>{request.property?.name}</TableCell>
                      <TableCell>{request.rentee?.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {request.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(request.status)} 
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          {request.landlordNotes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {request.landlordNotes}
                            </Typography>
                          )}
                          {request.costAmount && (
                            <Typography variant="body2" color="error.main" fontWeight={600}>
                              Cost: ${request.costAmount}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openMaintenanceDialog(request)}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>

        {/* Add Property Dialog */}
        <Dialog open={showAddProperty} onClose={() => setShowAddProperty(false)}>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleAddProperty} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                label="Property Name"
                fullWidth
                value={newProperty.name}
                onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                required
              />
              <TextField
                margin="normal"
                label="Street Address"
                fullWidth
                value={newProperty.address.street}
                onChange={(e) => setNewProperty({
                  ...newProperty,
                  address: { ...newProperty.address, street: e.target.value }
                })}
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="normal"
                    label="City"
                    fullWidth
                    value={newProperty.address.city}
                    onChange={(e) => setNewProperty({
                      ...newProperty,
                      address: { ...newProperty.address, city: e.target.value }
                    })}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="normal"
                    label="State"
                    fullWidth
                    value={newProperty.address.state}
                    onChange={(e) => setNewProperty({
                      ...newProperty,
                      address: { ...newProperty.address, state: e.target.value }
                    })}
                    required
                  />
                </Grid>
              </Grid>
              <TextField
                margin="normal"
                label="ZIP Code"
                fullWidth
                value={newProperty.address.zipCode}
                onChange={(e) => setNewProperty({
                  ...newProperty,
                  address: { ...newProperty.address, zipCode: e.target.value }
                })}
                required
              />
              <TextField
                margin="normal"
                label="Monthly Rent"
                type="number"
                fullWidth
                value={newProperty.rentAmount}
                onChange={(e) => setNewProperty({ ...newProperty, rentAmount: e.target.value })}
                required
              />
              {addPropertyError && (
                <Typography color="error" sx={{ mt: 1 }}>{addPropertyError}</Typography>
              )}
              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={() => setShowAddProperty(false)} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Add Property</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Add Tenant Dialog */}
        <Dialog open={showAddTenant} onClose={() => setShowAddTenant(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Tenant to {selectedProperty?.name}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleAddTenant} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter the email address of the rentee you want to add to this property.
              </Typography>
              <TextField
                margin="normal"
                label="Tenant Email"
                type="email"
                fullWidth
                value={newTenant.email}
                onChange={(e) => setNewTenant({ email: e.target.value })}
                required
              />
              {addTenantError && (
                <Typography color="error" sx={{ mt: 1 }}>{addTenantError}</Typography>
              )}
              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={() => setShowAddTenant(false)} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Add Tenant</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Maintenance Update Dialog */}
        <Dialog open={showMaintenanceDialog} onClose={() => setShowMaintenanceDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Update Maintenance Request</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleMaintenanceUpdate} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedMaintenanceRequest?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Property: {selectedMaintenanceRequest?.property?.name} | 
                    Tenant: {selectedMaintenanceRequest?.rentee?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedMaintenanceRequest?.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={maintenanceUpdate.status}
                      onChange={(e) => setMaintenanceUpdate({ ...maintenanceUpdate, status: e.target.value })}
                      label="Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    label="Cost Amount ($)"
                    type="number"
                    fullWidth
                    value={maintenanceUpdate.costAmount}
                    onChange={(e) => setMaintenanceUpdate({ ...maintenanceUpdate, costAmount: e.target.value })}
                    helperText="Leave empty if no cost"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    label="Notes/Response"
                    fullWidth
                    multiline
                    rows={4}
                    value={maintenanceUpdate.landlordNotes}
                    onChange={(e) => setMaintenanceUpdate({ ...maintenanceUpdate, landlordNotes: e.target.value })}
                    helperText="Provide feedback, reasons for rejection, or additional information"
                  />
                </Grid>
              </Grid>
              {maintenanceUpdateError && (
                <Typography color="error" sx={{ mt: 1 }}>{maintenanceUpdateError}</Typography>
              )}
              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={() => setShowMaintenanceDialog(false)} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Update Request</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Generate Bills Dialog */}
        <Dialog open={showGenerateBillsDialog} onClose={() => setShowGenerateBillsDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Generate Bills - {selectedPropertyForBills?.name}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={generateBills} sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Generate detailed bills for all tenants. Rent and utilities will be combined and distributed among tenants.
            </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    label="Month"
                    type="month"
                    fullWidth
                    value={billFormData.month}
                    onChange={(e) => handleBillFormChange('month', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    label="Due Date"
                    type="date"
                    fullWidth
                    value={billFormData.dueDate}
                    onChange={(e) => handleBillFormChange('dueDate', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>

              {/* Rent Section */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Rent</Typography>
                <TextField
                  margin="normal"
                  label="Monthly Rent Amount ($)"
                  type="number"
                  fullWidth
                  value={billFormData.rentAmount}
                  onChange={(e) => handleBillFormChange('rentAmount', e.target.value)}
                  helperText="Leave empty if no rent this month"
                />
              </Box>

              {/* Utilities Section */}
              <Box sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Utilities</Typography>
                  <Button size="small" onClick={addUtility} startIcon={<AddIcon />}>
                    Add Utility
                  </Button>
                </Box>
                {billFormData.utilities.map((utility, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Utility Name"
                          fullWidth
                          size="small"
                          value={utility.name}
                          onChange={(e) => handleBillFormChange('utilities', { name: e.target.value }, index)}
                          placeholder="e.g., Electricity, Water, Gas"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          label="Amount ($)"
                          type="number"
                          fullWidth
                          size="small"
                          value={utility.amount}
                          onChange={(e) => handleBillFormChange('utilities', { amount: e.target.value }, index)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Details (Optional)"
                          fullWidth
                          size="small"
                          value={utility.details}
                          onChange={(e) => handleBillFormChange('utilities', { details: e.target.value }, index)}
                          placeholder="e.g., Usage details, meter readings"
                        />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <IconButton 
                          onClick={() => removeUtility(index)} 
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    
                    {/* Note: Utilities are now part of the total distribution at the bottom */}
                  </Box>
                ))}
              </Box>

              {/* Other Fees Section */}
              <Box sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Other Fees</Typography>
                  <Button size="small" onClick={addOtherFee} startIcon={<AddIcon />}>
                    Add Fee
                  </Button>
                </Box>
                {billFormData.otherFees.map((fee, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Fee Name"
                          fullWidth
                          size="small"
                          value={fee.name}
                          onChange={(e) => handleBillFormChange('otherFees', { name: e.target.value }, index)}
                          placeholder="e.g., Maintenance, Parking, Internet"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          label="Amount ($)"
                          type="number"
                          fullWidth
                          size="small"
                          value={fee.amount}
                          onChange={(e) => handleBillFormChange('otherFees', { amount: e.target.value }, index)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Details (Optional)"
                          fullWidth
                          size="small"
                          value={fee.details}
                          onChange={(e) => handleBillFormChange('otherFees', { details: e.target.value }, index)}
                          placeholder="e.g., Shared maintenance, monthly fee"
                        />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <IconButton 
                          onClick={() => removeOtherFee(index)} 
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    
                    {/* Fee Tenant Assignments */}
                    {fee.name && fee.amount && parseFloat(fee.amount) > 0 && selectedPropertyForBills?.tenants?.length > 0 && (
                      <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fff8f0' }}>
                        <Typography variant="subtitle2" gutterBottom color="primary">
                          {fee.name} Distribution Among Tenants
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Default: Equal split (${(parseFloat(fee.amount) / selectedPropertyForBills.tenants.length).toFixed(2)} each)
                        </Typography>
                        {selectedPropertyForBills.tenants.map((tenant) => {
                          const assignment = billFormData.feeAssignments
                            .find(fa => fa.feeName === fee.name)
                            ?.assignments?.find(a => a.tenantId === tenant._id);
                          const defaultAmount = parseFloat(fee.amount) / selectedPropertyForBills.tenants.length;
                          const currentAmount = assignment?.amount || defaultAmount;
                          
                          return (
                            <Box key={tenant._id} sx={{ mb: 1 }}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={6}>
                                  <Typography variant="body2" fontWeight={500}>
                                    {tenant.name || tenant.email}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    label="Amount ($)"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={currentAmount}
                                    onChange={(e) => updateFeeAssignment(fee.name, tenant._id, e.target.value)}
                                    helperText={`${((currentAmount / parseFloat(fee.amount)) * 100).toFixed(1)}%`}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Total Distribution Section */}
              {getTotalAmount() > 0 && selectedPropertyForBills?.tenants?.length > 0 && (
                <Box sx={{ mt: 3, p: 3, border: '2px solid #2563eb', borderRadius: 2, backgroundColor: '#f0f8ff' }}>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight={700}>
                    Total Distribution Among Tenants
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Based on: Rent (${parseFloat(billFormData.rentAmount || 0).toFixed(2)}) + Utilities (${billFormData.utilities.reduce((sum, util) => sum + (parseFloat(util.amount) || 0), 0).toFixed(2)}) = ${getTotalAmount().toFixed(2)} total
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Default: Equal split (${(getTotalAmount() / selectedPropertyForBills.tenants.length).toFixed(2)} each)
                  </Typography>
                  
                  {billFormData.rentAssignments.map((assignment, index) => (
                    <Box key={assignment.tenantId} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: 'white' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                          <Typography variant="body1" fontWeight={600}>
                            {assignment.tenantName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Total Amount ($)"
                            type="number"
                            fullWidth
                            value={assignment.amount}
                            onChange={(e) => updateRentAssignment(assignment.tenantId, e.target.value)}
                            helperText={`${((assignment.amount / getTotalAmount()) * 100).toFixed(1)}% of total`}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      Total Assigned: ${billFormData.rentAssignments.reduce((sum, a) => sum + a.amount, 0).toFixed(2)} / ${getTotalAmount().toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {billFormError && (
                <Typography color="error" sx={{ mt: 2 }}>{billFormError}</Typography>
              )}
              {billFormSuccess && (
                <Typography color="success.main" sx={{ mt: 2 }}>{billFormSuccess}</Typography>
              )}
              
              <DialogActions sx={{ mt: 3 }}>
                <Button onClick={() => setShowGenerateBillsDialog(false)} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Generate Bills
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Edit Property Dialog */}
        <Dialog open={showEditProperty} onClose={() => setShowEditProperty(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Property - {editingProperty.name}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleEditProperty} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                label="Property Name"
                fullWidth
                value={editingProperty.name}
                onChange={(e) => handleEditPropertyChange('name', e.target.value)}
                required
              />
              <TextField
                margin="normal"
                label="Street Address"
                fullWidth
                value={editingProperty.address.street}
                onChange={(e) => handleEditPropertyChange('address.street', e.target.value)}
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="normal"
                    label="City"
                    fullWidth
                    value={editingProperty.address.city}
                    onChange={(e) => handleEditPropertyChange('address.city', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="normal"
                    label="State"
                    fullWidth
                    value={editingProperty.address.state}
                    onChange={(e) => handleEditPropertyChange('address.state', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
              <TextField
                margin="normal"
                label="ZIP Code"
                fullWidth
                value={editingProperty.address.zipCode}
                onChange={(e) => handleEditPropertyChange('address.zipCode', e.target.value)}
                required
              />
              <TextField
                margin="normal"
                label="Monthly Rent"
                type="number"
                fullWidth
                value={editingProperty.rentAmount}
                onChange={(e) => handleEditPropertyChange('rentAmount', e.target.value)}
                required
              />
              {editPropertyError && (
                <Typography color="error" sx={{ mt: 1 }}>{editPropertyError}</Typography>
              )}
              {editPropertySuccess && (
                <Typography color="success.main" sx={{ mt: 1 }}>{editPropertySuccess}</Typography>
              )}
              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={() => setShowEditProperty(false)} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Update Property</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </VideoBackground>
  );
};

export default LandlordDashboard; 