import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  AppBar,
  Toolbar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import VideoBackground from '../components/VideoBackground';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'rentee'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred');
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    setForgotPasswordSuccess('');

    try {
      const response = await fetch(buildApiUrl('/api/password-reset/request'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordSuccess(data.message);
        setForgotPasswordEmail('');
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordSuccess('');
        }, 3000);
      } else {
        setForgotPasswordError(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setForgotPasswordError('An error occurred while sending reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <VideoBackground videoSrc="/videos/login-bg.mp4">
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>z-Letly</Link>
          </Typography>
          <Button component={Link} to="/" color="primary" variant="outlined" size="small">
            Back to Home
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper elevation={4} sx={{ p: 4, width: '100%', mt: 6, bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
            {isLogin ? 'Welcome back' : 'Join z-Letly'}
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {!isLogin && (
              <TextField
                margin="normal"
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
              />
            )}
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {!isLogin && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">I am a</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="I am a"
                  onChange={handleChange}
                >
                  <MenuItem value="rentee">Rentee (Tenant)</MenuItem>
                  <MenuItem value="landlord">Landlord (Property Owner)</MenuItem>
                </Select>
              </FormControl>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Create account')}
            </Button>
          </Box>
          
          {/* Forgot Password Link */}
          {isLogin && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                onClick={() => setShowForgotPassword(true)}
                color="secondary"
                sx={{ fontWeight: 500 }}
              >
                Forgot your password?
              </Button>
            </Box>
          )}
          
          <Button
            onClick={() => setIsLogin(!isLogin)}
            fullWidth
            color="secondary"
            sx={{ mt: 1, fontWeight: 500 }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Button>
        </Paper>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onClose={() => setShowForgotPassword(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </DialogContentText>
          <Box component="form" onSubmit={handleForgotPassword}>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
            />
            {forgotPasswordError && (
              <Alert severity="error" sx={{ mt: 2 }}>{forgotPasswordError}</Alert>
            )}
            {forgotPasswordSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>{forgotPasswordSuccess}</Alert>
            )}
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setShowForgotPassword(false)} color="secondary">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={forgotPasswordLoading}
              >
                {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </VideoBackground>
  );
};

export default Login; 