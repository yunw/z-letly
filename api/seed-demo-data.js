import bcrypt from 'bcryptjs';
import dbConnect from './lib/mongodb.js';
import { User, Property, Bill } from './lib/models.js';

async function seedDemoData() {
  try {
    // Check for MongoDB URI
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is required');
      console.log('');
      console.log('📋 Please set your MongoDB URI:');
      console.log('export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/zletly"');
      console.log('');
      console.log('🔧 Or create a .env.local file in the api directory with:');
      console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zletly');
      console.log('JWT_SECRET=your-secure-jwt-secret');
      process.exit(1);
    }

    await dbConnect();
    console.log('🌱 Seeding demo data...');

    // Clear existing demo data
    await User.deleteMany({ email: { $in: ['landlord@test.com', 'rentee@test.com'] } });
    await Property.deleteMany({});
    await Bill.deleteMany({});

    // Create demo landlord
    const landlordPassword = await bcrypt.hash('password123', 10);
    const landlord = new User({
      email: 'landlord@test.com',
      password: landlordPassword,
      name: 'Demo Landlord',
      role: 'landlord',
      phone: '+1-555-0123'
    });
    await landlord.save();
    console.log('✅ Created demo landlord');

    // Create demo rentee
    const renteePassword = await bcrypt.hash('password123', 10);
    const rentee = new User({
      email: 'rentee@test.com',
      password: renteePassword,
      name: 'Demo Rentee',
      role: 'rentee',
      phone: '+1-555-0456'
    });
    await rentee.save();
    console.log('✅ Created demo rentee');

    // Create demo property
    const property = new Property({
      landlord: landlord._id,
      name: 'Demo Apartment Complex',
      address: {
        street: '123 Main Street',
        city: 'Demo City',
        state: 'DC',
        zipCode: '12345'
      },
      rentAmount: 1500,
      tenants: [rentee._id],
      utilities: [
        {
          name: 'Electricity',
          amount: 200,
          splitType: 'equal'
        },
        {
          name: 'Water',
          amount: 100,
          splitType: 'equal'
        }
      ]
    });
    await property.save();
    console.log('✅ Created demo property');

    // Create demo bills
    const currentMonth = new Date().toISOString().slice(0, 7);
    const demoBills = [
      {
        property: property._id,
        tenant: rentee._id,
        type: 'rent',
        amount: 1800, // rent + utilities
        description: `Rent and utilities for ${currentMonth}`,
        dueDate: new Date(),
        status: 'pending',
        month: currentMonth,
        splitPercentage: 100
      }
    ];

    await Bill.insertMany(demoBills);
    console.log('✅ Created demo bills');

    console.log('🎉 Demo data seeded successfully!');
    console.log('');
    console.log('📋 Demo Credentials:');
    console.log('Landlord: landlord@test.com / password123');
    console.log('Rentee: rentee@test.com / password123');
    console.log('');
    console.log('🏠 Demo Property: Demo Apartment Complex');
    console.log('💰 Monthly Rent: $1,500 + $300 utilities = $1,800');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

seedDemoData(); 