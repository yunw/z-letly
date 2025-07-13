import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Environment variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT || 'NOT SET'); 