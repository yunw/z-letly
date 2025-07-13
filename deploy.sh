#!/bin/bash

# z-Letly Deployment Script
echo "🚀 Starting z-Letly deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build frontend for production
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
else
    echo "📁 Frontend built! You can now:"
    echo "   1. Upload the 'frontend/dist' folder to Netlify"
    echo "   2. Or install Vercel CLI: npm install -g vercel"
    echo "   3. Then run: vercel --prod"
fi

echo "🎉 Deployment process completed!"
echo "🔗 Your backend is at: https://letly-ouqc.onrender.com/"
echo "📖 See DEPLOYMENT_GUIDE.md for more options" 