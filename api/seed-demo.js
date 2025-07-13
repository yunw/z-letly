import bcrypt from 'bcryptjs';
import dbConnect from './lib/mongodb.js';
import { User, Property, Bill } from './lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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

    res.status(200).json({
      message: 'Demo data seeded successfully!',
      demoCredentials: {
        landlord: 'landlord@test.com / password123',
        rentee: 'rentee@test.com / password123'
      },
      demoProperty: 'Demo Apartment Complex',
      monthlyRent: '$1,500 + $300 utilities = $1,800'
    });

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    res.status(500).json({ message: 'Error seeding demo data', error: error.message });
  }
} 