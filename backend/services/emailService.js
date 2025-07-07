const nodemailer = require('nodemailer');

// Create a test account for development (you can replace with real SMTP settings)
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    return null;
  }
};

// For production, use real SMTP settings
const createProductionTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Initialize transporter based on environment
let transporter = null;

if (process.env.NODE_ENV === 'production') {
  transporter = createProductionTransporter();
} else {
  // For development, create a simple test transporter
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@ethereal.email',
      pass: 'test123',
    },
  });
}

// Email templates
const emailTemplates = {
  newBill: (tenantName, propertyName, billType, amount, dueDate) => ({
    subject: `New Bill Generated - ${billType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Bill Notification</h2>
        <p>Hello ${tenantName},</p>
        <p>A new bill has been generated for your property.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Bill Details:</h3>
          <p><strong>Property:</strong> ${propertyName}</p>
          <p><strong>Bill Type:</strong> ${billType}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard to view the full details and mark the bill as paid.</p>
        <p>Best regards,<br>z-Letly Team</p>
      </div>
    `
  }),

  billPaid: (tenantName, propertyName, billType, amount) => ({
    subject: `Payment Confirmed - ${billType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Payment Confirmed</h2>
        <p>Hello ${tenantName},</p>
        <p>Your payment has been successfully recorded.</p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details:</h3>
          <p><strong>Property:</strong> ${propertyName}</p>
          <p><strong>Bill Type:</strong> ${billType}</p>
          <p><strong>Amount Paid:</strong> $${amount}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Thank you for your payment!</p>
        <p>Best regards,<br>z-Letly Team</p>
      </div>
    `
  }),

  newMaintenanceRequest: (landlordName, propertyName, tenantName, title, description) => ({
    subject: `New Maintenance Request - ${propertyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Maintenance Request</h2>
        <p>Hello ${landlordName},</p>
        <p>A new maintenance request has been submitted for your property.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Request Details:</h3>
          <p><strong>Property:</strong> ${propertyName}</p>
          <p><strong>Tenant:</strong> ${tenantName}</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Date Submitted:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard to review and respond to this request.</p>
        <p>Best regards,<br>z-Letly Team</p>
      </div>
    `
  }),

  maintenanceUpdate: (tenantName, propertyName, title, status, landlordNotes, costAmount) => ({
    subject: `Maintenance Request Update - ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Maintenance Request Update</h2>
        <p>Hello ${tenantName},</p>
        <p>Your maintenance request has been updated.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Update Details:</h3>
          <p><strong>Property:</strong> ${propertyName}</p>
          <p><strong>Request Title:</strong> ${title}</p>
          <p><strong>Status:</strong> <span style="color: ${getStatusColor(status)};">${getStatusLabel(status)}</span></p>
          ${landlordNotes ? `<p><strong>Landlord Notes:</strong> ${landlordNotes}</p>` : ''}
          ${costAmount ? `<p><strong>Cost:</strong> $${costAmount}</p>` : ''}
          <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard for more details.</p>
        <p>Best regards,<br>z-Letly Team</p>
      </div>
    `
  }),

  passwordReset: (userName, resetLink) => ({
    subject: 'Password Reset Request - z-Letly',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password for your z-Letly account.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Reset Your Password</h3>
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetLink}" style="color: #dc2626;">${resetLink}</a>
          </p>
        </div>
        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>Best regards,<br>z-Letly Team</p>
      </div>
    `
  })
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'in_progress': return '#3b82f6';
    case 'resolved': return '#059669';
    case 'rejected': return '#dc2626';
    default: return '#6b7280';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'rejected': return 'Rejected';
    default: return status;
  }
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    if (!transporter) {
      console.error('Email transporter not available');
      return false;
    }

    const { subject, html } = emailTemplates[template](...data);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@zletly.com',
      to: to,
      subject: subject,
      html: html
    };

    // For development, just log the email content
    if (process.env.NODE_ENV !== 'production') {
      console.log('=== EMAIL NOTIFICATION ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Content:', html);
      console.log('==========================');
      return true;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Specific notification functions
const sendNewBillNotification = async (tenantEmail, tenantName, propertyName, billType, amount, dueDate) => {
  return await sendEmail(tenantEmail, 'newBill', [tenantName, propertyName, billType, amount, dueDate]);
};

const sendBillPaidNotification = async (tenantEmail, tenantName, propertyName, billType, amount) => {
  return await sendEmail(tenantEmail, 'billPaid', [tenantName, propertyName, billType, amount]);
};

const sendNewMaintenanceRequestNotification = async (landlordEmail, landlordName, propertyName, tenantName, title, description) => {
  return await sendEmail(landlordEmail, 'newMaintenanceRequest', [landlordName, propertyName, tenantName, title, description]);
};

const sendMaintenanceUpdateNotification = async (tenantEmail, tenantName, propertyName, title, status, landlordNotes, costAmount) => {
  return await sendEmail(tenantEmail, 'maintenanceUpdate', [tenantName, propertyName, title, status, landlordNotes, costAmount]);
};

const sendPasswordResetNotification = async (userEmail, userName, resetLink) => {
  return await sendEmail(userEmail, 'passwordReset', [userName, resetLink]);
};

module.exports = {
  sendNewBillNotification,
  sendBillPaidNotification,
  sendNewMaintenanceRequestNotification,
  sendMaintenanceUpdateNotification,
  sendPasswordResetNotification
}; 