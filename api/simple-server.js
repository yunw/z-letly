import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Load environment variables FIRST
dotenv.config();

console.log('Starting server...');
console.log('Environment variables loaded:', {
  mongodb: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
  jwt: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
  port: process.env.PORT || 'NOT SET'
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'z-Letly API Development Server is running',
    env: {
      mongodb: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      jwt: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      port: process.env.PORT || 'NOT SET'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = 3001; // Use fixed port for testing

console.log(`Attempting to start server on port ${PORT}...`);

app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on http://localhost:${PORT}`);
  console.log(`📝 Test endpoints:`);
  console.log(`   GET  / - Server info`);
  console.log(`   GET  /health - Health check`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
}); 