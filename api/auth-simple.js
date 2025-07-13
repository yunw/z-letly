import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    console.log('Simple auth endpoint called:', req.method, req.url, req.query);
    
    const { action } = req.query;

    // Simple test endpoint
    if (req.method === 'GET' && action === 'test') {
      return res.status(200).json({ 
        message: 'Simple auth endpoint working',
        timestamp: new Date().toISOString()
      });
    }

    // Simple login test (without database)
    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body;
      
      // For testing, accept any email/password
      if (email && password) {
        const token = jwt.sign(
          { userId: 'test-user', email: email, role: 'rentee' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        const userResponse = {
          _id: 'test-user',
          email: email,
          name: 'Test User',
          role: 'rentee',
          phone: '',
          createdAt: new Date()
        };
        
        return res.status(200).json({ 
          message: 'Login successful (test mode)', 
          user: userResponse, 
          token 
        });
      } else {
        return res.status(400).json({ message: 'Email and password are required' });
      }
    }

    res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.error('Simple auth handler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 