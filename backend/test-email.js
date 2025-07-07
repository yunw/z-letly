const { sendNewBillNotification, sendBillPaidNotification, sendNewMaintenanceRequestNotification, sendMaintenanceUpdateNotification } = require('./services/emailService');

async function testEmailService() {
  console.log('Testing email service...');
  
  try {
    // Test new bill notification
    console.log('Testing new bill notification...');
    await sendNewBillNotification(
      'test@example.com',
      'John Doe',
      'Sunset Apartments',
      'rent',
      1200,
      new Date()
    );
    
    // Test bill paid notification
    console.log('Testing bill paid notification...');
    await sendBillPaidNotification(
      'test@example.com',
      'John Doe',
      'Sunset Apartments',
      'rent',
      1200
    );
    
    // Test new maintenance request notification
    console.log('Testing new maintenance request notification...');
    await sendNewMaintenanceRequestNotification(
      'landlord@example.com',
      'Jane Smith',
      'Sunset Apartments',
      'John Doe',
      'Leaky Faucet',
      'The kitchen faucet is leaking and needs repair.'
    );
    
    // Test maintenance update notification
    console.log('Testing maintenance update notification...');
    await sendMaintenanceUpdateNotification(
      'test@example.com',
      'John Doe',
      'Sunset Apartments',
      'Leaky Faucet',
      'in_progress',
      'We have scheduled a plumber for tomorrow.',
      150
    );
    
    console.log('All email tests completed successfully!');
    console.log('Check the console output above for Ethereal preview URLs.');
    
  } catch (error) {
    console.error('Error testing email service:', error);
  }
}

// Run the test
testEmailService(); 