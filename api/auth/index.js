import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../lib/mongodb.js';
import { User } from '../lib/models.js';

export default async function handler(req, res) {
  await dbConnect();

  // /api/auth/login
  if (req.method === 'POST' && req.url.endsWith('/login')) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      const userResponse = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt
      };
      res.status(200).json({ message: 'Login successful', user: userResponse, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  // /api/auth/register
  if (req.method === 'POST' && req.url.endsWith('/register')) {
    try {
      const { email, password, name, role, phone } = req.body;
      if (!email || !password || !name || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      if (role !== 'landlord' && role !== 'rentee') {
        return res.status(400).json({ message: 'Invalid role' });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({ email, password: hashedPassword, name, role, phone });
      await user.save();
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      const userResponse = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt
      };
      res.status(201).json({ message: 'User registered successfully', user: userResponse, token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  // /api/auth/me
  if (req.method === 'GET' && req.url.endsWith('/me')) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      res.status(200).json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Auth check error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  res.status(404).json({ message: 'Not found' });
} 