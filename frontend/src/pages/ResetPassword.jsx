import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  AppBar,
  Toolbar,
  Container,
  CircularProgress,
} from '@mui/material';
import VideoBackground from '../components/VideoBackground';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setError('Invalid reset link. Please request a new password reset.');
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/password-reset/verify?token=${token}&email=${encodeURIComponent(email)}`);
        
        if (response.ok) {
          setTokenValid(true);
        } else {
          setError('This reset link is invalid or has expired. Please request a new password reset.');
        }
      } catch (error) {
        setError('An error occurred while verifying the reset link.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred while resetting password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (verifying) {
    return (
      <VideoBackground videoSrc="/videos/login-bg.mp4">
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>z-Letly</Link>
            </Typography>
            <Button component={Link} to="/login" color="primary" variant="outlined" size="small">
              Back to Login
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <Paper elevation={4} sx={{ p: 4, width: '100%', mt: 6, bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Verifying reset link...</Typography>
          </Paper>
        </Container>
      </VideoBackground>
    );
  }

  return (
    <VideoBackground videoSrc="/videos/login-bg.mp4">
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>z-Letly</Link>
          </Typography>
          <Button component={Link} to="/login" color="primary" variant="outlined" size="small">
            Back to Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper elevation={4} sx={{ p: 4, width: '100%', mt: 6, bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
            Reset Password
          </Typography>
          
          {!tokenValid ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Back to Login
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                Enter your new password below
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                )}
                
                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>
                )}
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </VideoBackground>
  );
};

export default ResetPassword; 