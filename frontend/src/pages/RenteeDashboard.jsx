import React, { useState, useEffect } from 'react';
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
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import VideoBackground from '../components/VideoBackground';

const RenteeDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState({});
  const [properties, setProperties] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    property: '',
    title: '',
    description: ''
  });
  const [addRequestError, setAddRequestError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchBills();
    fetchSummary();
    fetchProperties();
    fetchMaintenanceRequests();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/bills/tenant', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBills(data.bills || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/bills/summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSummary(data.summary || {});
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/properties/rentee', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceRequests = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/maintenance/rentee', {
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

  const markBillPaid = async (billId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bills/${billId}/paid`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchBills();
        fetchSummary();
      }
    } catch (error) {
      console.error('Error marking bill as paid:', error);
    }
  };

  const handleAddRequest = async (e) => {
    e.preventDefault();
    setAddRequestError('');
    try {
      const response = await fetch('http://localhost:8080/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRequest)
      });

      if (response.ok) {
        setShowAddRequest(false);
        setNewRequest({ property: '', title: '', description: '' });
        fetchMaintenanceRequests();
      } else {
        const errorData = await response.json();
        setAddRequestError(errorData.message || 'Failed to submit request.');
      }
    } catch (error) {
      setAddRequestError('Error submitting request: ' + error.message);
      console.error('Error submitting request:', error);
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
    <VideoBackground videoSrc="/videos/rentee-bg.mp4">
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
            z-Letly <span style={{ fontWeight: 400, fontSize: 16, marginLeft: 8, color: '#888' }}>Rentee Dashboard</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <Button onClick={handleLogout} color="primary" variant="outlined" size="small">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Bill Management</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>Track your bills and payments</Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ my: 2 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Total Bills</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.totalBills || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Paid</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.paidBills || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Pending</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.pendingBills || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Total Amount</Typography>
                <Typography variant="h5" fontWeight={700}>${summary.totalAmount || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Properties Section */}
        <Box mt={4} mb={2}>
          <Typography variant="h6">Your Properties</Typography>
        </Box>
        {properties.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
            No properties assigned yet. Contact your landlord to get started.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={700}>{property.name}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {property.address.street}, {property.address.city}, {property.address.state}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
                      ${property.rentAmount}/month
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Landlord: {property.landlord?.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Bills Section */}
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>Your Bills</Typography>
          {bills.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
              No bills yet. Bills will appear here once your landlord generates them.
            </Typography>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill._id}>
                      <TableCell>{bill.property?.name}</TableCell>
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
                      <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
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
                      <TableCell>
                        {bill.status === 'pending' && (
                          <Button
                            size="small"
                            color="success"
                            variant="contained"
                            onClick={() => markBillPaid(bill._id)}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>

        {/* Maintenance Requests Section */}
        <Box mt={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Maintenance Requests</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowAddRequest(true)}
              disabled={properties.length === 0}
              startIcon={<BuildIcon />}
            >
              Submit Request
            </Button>
          </Box>
          {maintenanceRequests.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
              No maintenance requests yet. Submit your first request to get started.
            </Typography>
          ) : (
            <Paper sx={{ width: '100%', overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Landlord Response</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {request.property?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {request.title}
                        </Typography>
                      </TableCell>
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
                        <Typography variant="body2" color="text.secondary">
                          {new Date(request.updatedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>

        {/* Add Maintenance Request Dialog */}
        <Dialog open={showAddRequest} onClose={() => setShowAddRequest(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Submit Maintenance Request</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleAddRequest} sx={{ mt: 1 }}>
              <TextField
                select
                margin="normal"
                label="Property"
                fullWidth
                value={newRequest.property}
                onChange={(e) => setNewRequest({ ...newRequest, property: e.target.value })}
                required
              >
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.name} - {property.address.street}
                  </option>
                ))}
              </TextField>
              <TextField
                margin="normal"
                label="Title"
                fullWidth
                value={newRequest.title}
                onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                required
              />
              <TextField
                margin="normal"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                required
              />
              {addRequestError && (
                <Typography color="error" sx={{ mt: 1 }}>{addRequestError}</Typography>
              )}
              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={() => setShowAddRequest(false)} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Submit Request</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </VideoBackground>
  );
};

export default RenteeDashboard; 