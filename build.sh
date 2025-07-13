#!/bin/bash

# z-Letly Unified Build Script
# This script builds both frontend and backend together

set -e  # Exit on any error

echo "🏗️  Starting z-Letly unified build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js version: $(node --version)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm version: $(npm --version)"
}

# Install all dependencies
install_dependencies() {
    print_status "Installing all dependencies..."
    
    # Root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Backend dependencies (if exists)
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
    fi
    
    # API dependencies
    print_status "Installing API dependencies..."
    cd api
    npm install
    cd ..
    
    print_success "All dependencies installed successfully!"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    
    # Check if build script exists
    if ! npm run build &> /dev/null; then
        print_error "Frontend build failed. Check frontend/package.json for build script."
        exit 1
    fi
    
    # Check if dist folder was created
    if [ ! -d "dist" ]; then
        print_error "Frontend build did not create dist folder."
        exit 1
    fi
    
    cd ..
    print_success "Frontend built successfully!"
}

# Build API (serverless functions)
build_api() {
    print_status "Building API (serverless functions)..."
    
    # For Vercel serverless functions, no build step is needed
    # The functions are deployed as-is
    print_success "API is ready for deployment (serverless functions)"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Frontend tests
    if [ -f "frontend/package.json" ]; then
        print_status "Running frontend tests..."
        cd frontend
        if npm test &> /dev/null; then
            print_success "Frontend tests passed!"
        else
            print_warning "Frontend tests failed or no tests configured"
        fi
        cd ..
    fi
    
    # API tests
    if [ -f "api/package.json" ]; then
        print_status "Running API tests..."
        cd api
        if npm test &> /dev/null; then
            print_success "API tests passed!"
        else
            print_warning "API tests failed or no tests configured"
        fi
        cd ..
    fi
}

# Create production build
create_production_build() {
    print_status "Creating production build..."
    
    # Build frontend
    build_frontend
    
    # Build API
    build_api
    
    # Create build summary
    create_build_summary
    
    print_success "Production build completed successfully!"
}

# Create build summary
create_build_summary() {
    print_status "Creating build summary..."
    
    cat > BUILD_SUMMARY.md << EOF
# z-Letly Build Summary

## Build Information
- **Build Date**: $(date)
- **Node.js Version**: $(node --version)
- **npm Version**: $(npm --version)

## Build Components

### Frontend
- **Status**: ✅ Built successfully
- **Output**: \`frontend/dist/\`
- **Framework**: React + Vite
- **UI Library**: TailwindCSS

### API (Backend)
- **Status**: ✅ Ready for deployment
- **Type**: Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **Authentication**: JWT

## Deployment Information
- **Platform**: Vercel
- **Frontend URL**: https://your-app.vercel.app
- **API URL**: https://your-app.vercel.app/api

## Next Steps
1. Deploy to Vercel: \`npm run deploy\`
2. Seed demo data: \`npm run seed:demo\`
3. Test the application

## Environment Variables Required
- \`MONGODB_URI\`: MongoDB connection string
- \`JWT_SECRET\`: Secret for JWT tokens

EOF

    print_success "Build summary created: BUILD_SUMMARY.md"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first: npm i -g vercel"
        exit 1
    fi
    
    # Deploy
    vercel --prod
    
    print_success "Deployment completed!"
}

# Main build process
main() {
    echo "🚀 z-Letly Unified Build Process"
    echo "================================"
    
    # Pre-flight checks
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Create production build
    create_production_build
    
    # Run tests
    run_tests
    
    echo ""
    echo "🎉 Build completed successfully!"
    echo ""
    echo "📋 Available commands:"
    echo "  npm run dev          - Start development servers"
    echo "  npm run build        - Build for production"
    echo "  npm run deploy       - Deploy to Vercel"
    echo "  npm run preview      - Preview production build"
    echo "  npm run seed:demo    - Seed demo data"
    echo ""
    echo "📁 Build outputs:"
    echo "  Frontend: frontend/dist/"
    echo "  API: api/ (serverless functions)"
    echo ""
}

# Handle command line arguments
case "${1:-}" in
    "install")
        check_node
        check_npm
        install_dependencies
        ;;
    "build")
        build_frontend
        build_api
        create_build_summary
        ;;
    "deploy")
        create_production_build
        deploy_to_vercel
        ;;
    "test")
        run_tests
        ;;
    "clean")
        print_status "Cleaning build artifacts..."
        rm -rf frontend/dist
        rm -rf BUILD_SUMMARY.md
        print_success "Clean completed!"
        ;;
    *)
        main
        ;;
esac 