# Email Notification Setup Guide

## Overview

The z-Letly application now includes email notifications for billing and maintenance updates. This guide will help you set up email functionality for both development and production environments.

## Email Notifications Included

1. **New Bill Notifications** - Sent to tenants when bills are generated
2. **Payment Confirmations** - Sent to tenants when bills are marked as paid
3. **New Maintenance Requests** - Sent to landlords when tenants submit maintenance requests
4. **Maintenance Updates** - Sent to tenants when landlords update maintenance request status

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@zletly.com
EMAIL_REPLY_TO=support@zletly.com
EMAIL_NOTIFICATIONS_ENABLED=true

# For development (using Ethereal for testing)
ETHEREAL_USER=your_ethereal_user
ETHEREAL_PASS=your_ethereal_password
```

## Development Setup (Using Ethereal)

For development, the application uses Ethereal Email (a fake SMTP service) to test email functionality:

1. **Install nodemailer** (already done):
   ```bash
   npm install nodemailer
   ```

2. **The application automatically creates test accounts** when running in development mode

3. **View test emails**: When emails are sent in development, the console will show a preview URL where you can view the email

## Production Setup (Using Gmail)

For production, you can use Gmail or any other SMTP service:

### Gmail Setup:

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

3. **Set Environment Variables**:
   ```env
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   EMAIL_FROM=noreply@zletly.com
   EMAIL_REPLY_TO=support@zletly.com
   NODE_ENV=production
   ```

### Other SMTP Services:

You can also use services like:
- **SendGrid**
- **Mailgun**
- **Amazon SES**
- **Postmark**

Update the email configuration in `services/emailService.js` for your chosen service.

## Email Templates

The application includes professionally designed HTML email templates for:

### New Bill Notification
- Sent to tenants when bills are generated
- Includes property name, bill type, amount, and due date
- Professional styling with z-Letly branding

### Payment Confirmation
- Sent to tenants when bills are marked as paid
- Confirms payment details and amount
- Green styling to indicate success

### New Maintenance Request
- Sent to landlords when tenants submit maintenance requests
- Includes property, tenant, title, and description
- Red styling to indicate urgency

### Maintenance Update
- Sent to tenants when landlords update request status
- Includes status, notes, and cost information
- Color-coded status indicators

## Testing Email Notifications

### Development Testing:

1. **Start the backend server**:
   ```bash
   npm run dev
   ```

2. **Generate bills** or **submit maintenance requests** through the frontend

3. **Check console output** for email preview URLs

4. **View test emails** at the provided Ethereal URLs

### Production Testing:

1. **Set up production email credentials**

2. **Test with real email addresses**

3. **Monitor email delivery** through your email service dashboard

## Troubleshooting

### Common Issues:

1. **Emails not sending**:
   - Check environment variables are set correctly
   - Verify email service credentials
   - Check console for error messages

2. **Gmail authentication errors**:
   - Ensure 2FA is enabled
   - Use app password, not regular password
   - Check if "Less secure app access" is disabled

3. **Development emails not showing**:
   - Check console for Ethereal preview URLs
   - Ensure `NODE_ENV` is not set to 'production'

### Debug Mode:

Enable debug logging by adding to your `.env`:
```env
EMAIL_DEBUG=true
```

## Security Considerations

1. **Never commit email credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Use app passwords** instead of regular passwords
4. **Enable 2FA** on email accounts
5. **Monitor email sending** for unusual activity

## Performance Optimization

1. **Batch processing** for multiple emails
2. **Retry logic** for failed email attempts
3. **Async email sending** to avoid blocking requests
4. **Rate limiting** to prevent spam

## Customization

### Modifying Email Templates:

Edit the templates in `services/emailService.js`:

```javascript
const emailTemplates = {
  newBill: (tenantName, propertyName, billType, amount, dueDate) => ({
    subject: `New Bill Generated - ${billType}`,
    html: `Your custom HTML template here...`
  }),
  // ... other templates
};
```

### Adding New Notifications:

1. **Add new template** to `emailTemplates`
2. **Create notification function** in `emailService.js`
3. **Integrate into controllers** where needed
4. **Test thoroughly** before deployment

## Support

For issues with email setup:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Test with a simple email first
4. Contact support if issues persist 