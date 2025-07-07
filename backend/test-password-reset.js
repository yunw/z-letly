const { sendPasswordResetNotification } = require('./services/emailService');

async function testPasswordReset() {
  console.log('Testing password reset email...');
  
  try {
    // Test password reset notification
    console.log('Testing password reset notification...');
    await sendPasswordResetNotification(
      'test@example.com',
      'John Doe',
      'http://localhost:5173/reset-password?token=test123&email=test@example.com'
    );
    
    console.log('Password reset email test completed successfully!');
    console.log('Check the console output above for email preview.');
    
  } catch (error) {
    console.error('Error testing password reset email:', error);
  }
}

// Run the test
testPasswordReset(); 