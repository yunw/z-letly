#!/bin/bash

# z-Letly Vercel Deployment Script
echo "🚀 Starting z-Letly Vercel deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Install all dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm run install:all

# Build frontend
echo -e "${BLUE}🔨 Building frontend...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend built successfully!${NC}"
else
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi
cd ..

# Check if environment variables are set
echo -e "${YELLOW}🔧 Checking environment variables...${NC}"
echo "Make sure you have set these environment variables in Vercel:"
echo "  - MONGODB_URI: Your MongoDB Atlas connection string"
echo "  - JWT_SECRET: A secure random string for JWT tokens"
echo ""
echo "You can set them using:"
echo "  vercel env add MONGODB_URI"
echo "  vercel env add JWT_SECRET"
echo ""

# Deploy to Vercel
echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${GREEN}📋 Next Steps:${NC}"
    echo "1. Set environment variables in Vercel dashboard:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo ""
    echo "2. Seed demo data (after setting environment variables):"
    echo "   curl -X POST https://your-app.vercel.app/api/seed-demo"
    echo ""
    echo "3. Test your deployment:"
    echo "   - Visit your Vercel URL"
    echo "   - Login with demo credentials:"
    echo "     Landlord: landlord@test.com / password123"
    echo "     Rentee: rentee@test.com / password123"
    echo "   - Test all features"
    echo ""
    echo "3. Monitor your deployment:"
    echo "   - Check Vercel dashboard for function logs"
    echo "   - Monitor usage and performance"
    echo ""
    echo -e "${BLUE}📖 See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Check the error messages above and try again."
fi 