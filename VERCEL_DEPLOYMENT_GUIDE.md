# Vercel Deployment Guide for z-Letly

## 🚀 Complete Vercel Deployment (Frontend + Backend)

This guide will help you deploy both frontend and backend to Vercel using serverless functions.

## 📋 Prerequisites

1. **Vercel CLI**: Install if not already installed
   ```bash
   npm install -g vercel
   ```

2. **MongoDB Atlas**: Your database should be set up
3. **Environment Variables**: You'll need to set these in Vercel

## 🔧 Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

## 🔧 Step 2: Set Environment Variables

You need to set these environment variables in Vercel:

### Required Environment Variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT tokens

### How to Set Environment Variables:

#### Option A: Using Vercel CLI
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

#### Option B: Using Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add the variables:
   - `MONGODB_URI`: `mongodb+srv://username:password@cluster.mongodb.net/zletly`
   - `JWT_SECRET`: `your-secure-jwt-secret-here`

## 🔧 Step 3: Deploy to Vercel

### First Deployment:
```bash
# Deploy to Vercel
vercel --prod
```

### Follow-up Deployments:
```bash
# Deploy updates
vercel --prod
```

## 🧪 Step 4: Testing

### Test the Complete Flow:

1. **Frontend**: Visit your Vercel URL
2. **Registration**: Create landlord and rentee accounts
3. **Authentication**: Test login/logout
4. **Properties**: Add properties as landlord
5. **Bills**: Generate bills
6. **Payments**: Mark bills as paid as rentee

### Test API Endpoints:

```bash
# Test registration
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"landlord"}'

# Test login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔍 Step 5: Monitoring

### Vercel Dashboard:
- **Functions**: Monitor serverless function performance
- **Analytics**: Track usage and performance
- **Logs**: View function logs for debugging

### Function Limits (Free Tier):
- **Execution time**: 10 seconds max
- **Memory**: 1024MB
- **Daily executions**: 100/day
- **File size**: 50MB max

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check `MONGODB_URI` environment variable
   - Ensure MongoDB Atlas IP whitelist includes Vercel

2. **JWT Token Errors**:
   - Verify `JWT_SECRET` is set correctly
   - Check token expiration

3. **Function Timeout**:
   - Optimize database queries
   - Consider upgrading to Pro plan for longer timeouts

4. **CORS Issues**:
   - Vercel handles CORS automatically for same-domain requests

### Debug Commands:
```bash
# View function logs
vercel logs

# Test locally
vercel dev

# Check environment variables
vercel env ls
```

## 📊 Performance Optimization

### For Better Performance:
1. **Database Indexing**: Ensure proper MongoDB indexes
2. **Connection Pooling**: MongoDB connection is cached
3. **Function Optimization**: Keep functions lightweight
4. **CDN**: Vercel automatically serves static files via CDN

## 🔄 Development Workflow

### Local Development:
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend
npm run dev:backend
```

### Deployment Workflow:
1. Make changes to code
2. Test locally: `npm run dev`
3. Deploy: `vercel --prod`
4. Test production: Visit your Vercel URL

## 🎯 Benefits of Vercel Deployment

### ✅ Advantages:
- **Unified Platform**: Frontend and backend on same domain
- **Automatic Scaling**: Serverless functions scale automatically
- **Global CDN**: Fast loading worldwide
- **Zero Configuration**: Minimal setup required
- **Free Tier**: Generous free limits
- **Git Integration**: Automatic deployments from Git

### 📈 Cost Analysis:
- **Free Tier**: 100 function executions/day
- **Pro Plan**: $20/month for higher limits
- **Enterprise**: Custom pricing for large scale

## 🚀 Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
2. **Configure monitoring** and alerts
3. **Set up CI/CD** with Git integration
4. **Monitor usage** and optimize performance
5. **Scale up** if needed (Pro plan)

Your z-Letly app is now fully deployed on Vercel! 🎉 