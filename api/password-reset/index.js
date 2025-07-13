import jwt from 'jsonwebtoken';
import dbConnect from '../lib/mongodb.js';
import { PasswordReset, User } from '../lib/models.js';
import bcrypt from 'bcryptjs';

// Helper function to verify JWT token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default async function handler(req, res) {
  try {
    await dbConnect();

    switch (req.method) {
      case 'POST':
        return await requestPasswordReset(req, res);
      case 'PUT':
        return await resetPassword(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Password reset API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Request password reset
async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  // Save reset request
  const passwordReset = new PasswordReset({
    email,
    token,
    expiresAt: new Date(Date.now() + 3600000) // 1 hour
  });

  await passwordReset.save();

  res.status(200).json({ message: 'Password reset email sent' });
}

// Reset password
async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const resetRequest = await PasswordReset.findOne({ 
      email: decoded.email, 
      token,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword }
    );

    // Delete reset request
    await PasswordReset.deleteOne({ _id: resetRequest._id });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
} 