import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes with dynamic imports
app.post('/api/auth/login', async (req, res) => {
  const { default: authLogin } = await import('./auth/login.js');
  await authLogin(req, res);
});

app.post('/api/auth/register', async (req, res) => {
  const { default: authRegister } = await import('./auth/register.js');
  await authRegister(req, res);
});

app.get('/api/auth/me', async (req, res) => {
  const { default: authMe } = await import('./auth/me.js');
  await authMe(req, res);
});

app.all('/api/properties*', async (req, res) => {
  const { default: propertiesHandler } = await import('./properties/index.js');
  await propertiesHandler(req, res);
});

app.all('/api/bills*', async (req, res) => {
  const { default: billsHandler } = await import('./bills/index.js');
  await billsHandler(req, res);
});

app.all('/api/maintenance*', async (req, res) => {
  const { default: maintenanceHandler } = await import('./maintenance/index.js');
  await maintenanceHandler(req, res);
});

app.all('/api/password-reset*', async (req, res) => {
  const { default: passwordResetHandler } = await import('./password-reset/index.js');
  await passwordResetHandler(req, res);
});

app.post('/api/seed-demo', async (req, res) => {
  const { default: seedDemo } = await import('./seed-demo.js');
  await seedDemo(req, res);
});

// Health check
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

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 z-Letly API Development Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST /api/auth/login - User login`);
  console.log(`   POST /api/auth/register - User registration`);
  console.log(`   GET  /api/auth/me - Get current user`);
  console.log(`   POST /api/properties - Create property (landlord)`);
  console.log(`   GET  /api/properties - Get properties`);
  console.log(`   POST /api/bills/generate - Generate bills`);
  console.log(`   GET  /api/bills/landlord - Get landlord bills`);
  console.log(`   GET  /api/bills/tenant - Get tenant bills`);
  console.log(`   POST /api/seed-demo - Seed demo data`);
  console.log(`\n🔗 Frontend should connect to: http://localhost:${PORT}`);
}); 