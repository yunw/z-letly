# z-Letly Build Guide

## 🏗️ Unified Build System

This guide explains how to build both frontend and backend together using the unified build system.

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Vercel CLI**: For deployment (optional)

```bash
# Check versions
node --version
npm --version

# Install Vercel CLI (optional)
npm i -g vercel
```

## 🚀 Quick Start

### Option 1: Using npm scripts (Recommended)

```bash
# Install all dependencies and build everything
npm run build:all

# Or step by step:
npm run install:all    # Install all dependencies
npm run build          # Build frontend and prepare API
npm run deploy         # Deploy to Vercel
```

### Option 2: Using the build script

```bash
# Make script executable (first time only)
chmod +x build.sh

# Run complete build process
./build.sh

# Or run specific parts:
./build.sh install     # Install dependencies only
./build.sh build       # Build only
./build.sh deploy      # Build and deploy
./build.sh test        # Run tests only
./build.sh clean       # Clean build artifacts
```

## 📦 Available Commands

### Development Commands

```bash
# Start development servers (frontend + backend)
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only (if using traditional backend)
npm run dev:backend

# Start API development server
npm run dev:api
```

### Build Commands

```bash
# Build everything
npm run build

# Build frontend only
npm run build:frontend

# Build API (serverless functions)
npm run build:api

# Install all dependencies and build
npm run build:all
```

### Deployment Commands

```bash
# Deploy everything to Vercel
npm run deploy

# Deploy frontend only
npm run deploy:frontend

# Deploy API only
npm run deploy:api
```

### Utility Commands

```bash
# Install all dependencies
npm run install:all

# Clean build artifacts
npm run clean

# Clean everything (including node_modules)
npm run clean:all

# Preview production build
npm run preview

# Seed demo data
npm run seed

# Seed demo data via API
npm run seed:demo
```

## 🏗️ Build Process Details

### 1. Frontend Build

The frontend is built using Vite:

```bash
cd frontend
npm run build
```

**Output**: `frontend/dist/` directory containing:
- Optimized HTML, CSS, and JavaScript
- Static assets
- Production-ready bundle

### 2. API Build (Serverless Functions)

The API uses Vercel serverless functions, so no traditional build is needed:

```bash
# API functions are deployed as-is
cd api
# No build step required
```

**Output**: `api/` directory containing:
- Serverless function files
- Shared libraries
- Database models

### 3. Complete Build Process

```bash
# 1. Install dependencies
npm run install:all

# 2. Build frontend
npm run build:frontend

# 3. Prepare API (no build needed)
npm run build:api

# 4. Create build summary
# (automatically generated)
```

## 📁 Build Outputs

After a successful build, you'll have:

```
z-Letly/
├── frontend/
│   └── dist/           # Production frontend build
├── api/                # Serverless functions (ready for deployment)
├── BUILD_SUMMARY.md    # Build information and next steps
└── vercel.json         # Vercel configuration
```

## 🚀 Deployment

### Deploy to Vercel

```bash
# Deploy everything
npm run deploy

# Or use Vercel CLI directly
vercel --prod
```

### Environment Variables

Set these in your Vercel dashboard:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens

### Post-Deployment

After deployment:

1. **Seed demo data**:
   ```bash
   npm run seed:demo
   ```

2. **Test the application**:
   - Visit your Vercel URL
   - Login with demo credentials:
     - Landlord: `landlord@test.com` / `password123`
     - Rentee: `rentee@test.com` / `password123`

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test

# Run frontend tests only
npm run test:frontend

# Run API tests only
npm run test:api
```

### Test Demo Login

```bash
# Test demo data seeding and login
./test-demo-login.sh
```

## 🔧 Troubleshooting

### Common Issues

1. **Node.js version too old**:
   ```bash
   # Update Node.js to version 18+
   nvm install 18
   nvm use 18
   ```

2. **Build fails**:
   ```bash
   # Clean and rebuild
   npm run clean:all
   npm run install:all
   npm run build
   ```

3. **Deployment fails**:
   ```bash
   # Check Vercel CLI
   vercel --version
   
   # Login to Vercel
   vercel login
   ```

4. **Environment variables missing**:
   - Set `MONGODB_URI` and `JWT_SECRET` in Vercel dashboard
   - Redeploy after setting variables

### Build Script Options

```bash
./build.sh install    # Install dependencies only
./build.sh build      # Build only
./build.sh deploy     # Build and deploy
./build.sh test       # Run tests only
./build.sh clean      # Clean build artifacts
```

## 📊 Build Summary

After each build, a `BUILD_SUMMARY.md` file is created with:

- Build date and environment information
- Component build status
- Deployment information
- Next steps
- Required environment variables

## 🎯 Best Practices

1. **Always run `npm run install:all`** before building
2. **Use `npm run clean:all`** if you encounter build issues
3. **Set environment variables** before deployment
4. **Test locally** with `npm run preview` before deploying
5. **Seed demo data** after deployment for testing

## 📞 Support

If you encounter issues:

1. Check the build summary in `BUILD_SUMMARY.md`
2. Review the troubleshooting section above
3. Check the console output for specific error messages
4. Ensure all prerequisites are met

---

**Happy Building! 🚀** 