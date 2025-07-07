module.exports = {
  // Development settings (using Ethereal for testing)
  development: {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS,
    },
  },

  // Production settings (using Gmail or other SMTP service)
  production: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },

  // Email templates configuration
  templates: {
    from: process.env.EMAIL_FROM || 'noreply@zletly.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@zletly.com',
  },

  // Notification settings
  notifications: {
    // Enable/disable email notifications
    enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED !== 'false',
    
    // Retry settings for failed emails
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
    
    // Batch processing settings
    batchSize: 10,
    batchDelay: 1000, // 1 second between batches
  }
}; 