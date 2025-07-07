import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import UpdateIcon from '@mui/icons-material/Update';
import SecurityIcon from '@mui/icons-material/Security';
import BuildIcon from '@mui/icons-material/Build';
import VideoBackground from '../components/VideoBackground';

const features = [
  {
    title: 'Landlords',
    color: 'primary',
    points: [
      'Create and manage properties',
      'Add tenants by email',
      'Auto-generate rent and utility bills',
      'Track payment status',
      'Manage maintenance requests',
    ],
    description: 'Manage multiple properties, add tenants, generate bills automatically, track payments, and handle maintenance requests in real-time.'
  },
  {
    title: 'Rentees',
    color: 'secondary',
    points: [
      'View all assigned bills',
      'See detailed bill breakdowns',
      'Mark bills as paid',
      'Track payment history',
      'Submit maintenance requests',
    ],
    description: 'View your bills, see detailed breakdowns, track payments, submit maintenance requests, and manage your rental expenses easily.'
  },
  {
    title: 'Maintenance & Fixtures',
    color: 'success',
    points: [
      'Submit maintenance requests',
      'Track request status',
      'Real-time updates',
      'Easy communication',
    ],
    description: 'Submit and track maintenance requests, get real-time status updates, and communicate easily with your landlord or tenants.'
  },
  {
    title: 'Secure & Reliable',
    color: 'info',
    points: [
      'JWT authentication',
      'Encrypted data storage',
      'Cloud database backup',
      '99.9% uptime guarantee',
    ],
    description: 'Your data is protected with enterprise-grade security and stored in the cloud for reliability.'
  },
];

const featureIcons = [
  <HomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />, // Landlords
  <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />, // Rentees
  <BuildIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />, // Maintenance & Fixtures
  <SecurityIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />, // Secure & Reliable
];

const LandingPage = () => {
  return (
    <VideoBackground videoSrc="/videos/landing-bg.mp4">
      <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Navigation */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
            z-Letly
          </Typography>
          <Button component={Link} to="/login" color="primary" sx={{ mr: 2 }}>
            Login
          </Button>
          <Button component={Link} to="/login" variant="contained" color="primary">
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" fontWeight={800} gutterBottom color="primary.main">
              Simplify Home Management
            </Typography>
            {/* <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <img src="/favicon.svg" alt="z-Letly Home Logo" style={{ width: '60%', minWidth: 220, maxWidth: 340, filter: 'drop-shadow(0 4px 16px rgba(37,99,235,0.10))' }} />
            </Box> */}
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              The ultimate platform for landlords and rentees to manage properties, split bills, and track payments with ease. No more spreadsheets, no more confusion.
            </Typography>
            <Button component={Link} to="/login" variant="contained" color="primary" size="large" sx={{ mr: 2, px: 4, py: 1.5 }}>
              Start Free Trial
            </Button>
            <Button component={Link} to="#features" variant="outlined" color="primary" size="large" sx={{ px: 4, py: 1.5 }}>
              Learn More
            </Button>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            
          </Grid> */}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box id="features" sx={{ bgcolor: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" fontWeight={800} color="primary.main" gutterBottom>
            Everything you need for property management
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Streamline your rental property operations with our comprehensive suite of tools.
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title} display="flex" flexDirection="column" alignItems="center">
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  {featureIcons[idx]}
                  <Typography variant="h6" fontWeight={700} color={`${feature.color}.main`} gutterBottom>
                    {feature.title}
                  </Typography>
                </Box>
                <Card variant="outlined" sx={{
                  borderTop: 4,
                  borderColor: `${feature.color}.main`,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  boxShadow: 0,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px) scale(1.03)',
                  },
                }}>
                  <CardContent>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                      {feature.description}
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {feature.points.map((point) => (
                        <li key={point}>
                          <Typography variant="body2" color="text.primary">{point}</Typography>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="h6" color="primary.contrastText" sx={{ mb: 4 }}>
            Join thousands of landlords and rentees who trust z-Letly for their property management needs.
          </Typography>
          <Button component={Link} to="/login" variant="contained" color="secondary" size="large" sx={{ px: 5, py: 1.5, fontWeight: 700 }}>
            Sign up for free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Paper elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', py: 6, mt: 0 }} square>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
                z-Letly
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The modern solution for property management and bill splitting. Built for landlords and rentees who want simplicity and efficiency.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>Product</Typography>
                  <Typography variant="body2" color="text.secondary">Features</Typography>
                  <Typography variant="body2" color="text.secondary">Pricing</Typography>
                  <Typography variant="body2" color="text.secondary">API</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>Support</Typography>
                  <Typography variant="body2" color="text.secondary">Help Center</Typography>
                  <Typography variant="body2" color="text.secondary">Contact</Typography>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 6, pt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              &copy; 2024 z-Letly. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Paper>
    </Box>
    </VideoBackground>
  );
};

export default LandingPage; 