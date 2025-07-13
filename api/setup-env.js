import fs from 'fs';
import path from 'path';

const envContent = `# MongoDB Connection
MONGODB_URI=mongodb+srv://zendari2025:QKVU4RBqjfnGloBX@letly0.hxi7qqy.mongodb.net/zletly

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=3000
`;

const envPath = path.join(process.cwd(), '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created successfully!');
  console.log('📁 Location:', envPath);
  console.log('🔧 You can now run: npm run dev');
} catch (error) {
  console.error('❌ Error creating environment file:', error.message);
} 