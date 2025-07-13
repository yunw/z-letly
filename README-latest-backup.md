# z-Letly: Landlord & Rentee Bill Management App

## 🎯 Overview
A complete web application for small landlords and rentees to manage properties, assign tenants, and split bills (rent, utilities, internet, etc.) with ease.

## 🚀 Features

### Landing Page & Marketing:
- ✅ **Beautiful Landing Page**: Modern, responsive landing page showcasing app features
- ✅ **No Authentication Required**: Visitors can explore the app without signing up
- ✅ **Feature Showcase**: Detailed sections highlighting landlord and rentee benefits
- ✅ **Call-to-Action**: Clear paths to registration and login

### Landlord Features:
- ✅ **Property Management**: Create and manage multiple properties
- ✅ **Tenant Assignment**: Add rentees to properties by email
- ✅ **Bill Generation**: Auto-generate rent and utility bills
- ✅ **Bill Tracking**: View all bills and payment status
- ✅ **Dashboard**: Overview of properties and recent bills

### Rentee Features:
- ✅ **Bill Viewing**: See all assigned bills with breakdowns
- ✅ **Payment Tracking**: Mark bills as paid
- ✅ **Summary Dashboard**: View payment statistics
- ✅ **Property Info**: See property details and landlord info

### Technical Features:
- ✅ **Authentication**: JWT-based login/register system
- ✅ **Role-based Access**: Separate dashboards for landlords/rentees
- ✅ **Auto-calculation**: Split utilities equally among tenants
- ✅ **Real-time Updates**: Live bill status updates
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Database**: MongoDB Atlas for persistent data storage
- ✅ **Modern UI**: Beautiful gradient theme with glassmorphism effects

## 🛠️ Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcrypt
- **Deployment**: Vercel

## 🏗️ Unified Build System

### Quick Start

```bash
# Install all dependencies and build everything
npm run build:all

# Or step by step:
npm run install:all    # Install all dependencies
npm run build          # Build frontend and prepare API
npm run deploy         # Deploy to Vercel
```

### Available Commands

#### Development
```bash
# Start development servers (frontend + backend)
npm run dev

# Start frontend only
npm run dev:frontend

# Start API development server
npm run dev:api
```

#### Building
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

#### Deployment
```bash
# Deploy everything to Vercel
npm run deploy

# Deploy frontend only
npm run deploy:frontend

# Deploy API only
npm run deploy:api
```

#### Utilities
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

### Using the Build Script

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

## 📦 Installation & Setup

### Prerequisites
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

### Quick Setup

```bash
# Clone the repository
git clone <repository-url>
cd z-Letly

# Install all dependencies and build
npm run build:all

# Start development
npm run dev
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

## 🎮 How to Use

### 1. Explore the Landing Page
1. Visit your deployed URL
2. Browse the features and benefits
3. Click "Get Started" or "Login" to proceed

### 2. Register as Landlord
1. Click "Sign up" and select "Landlord" role
2. Fill in your details and create account

### 3. Add Properties
1. Login to landlord dashboard
2. Click "Add Property"
3. Fill in property details (name, address, rent amount)
4. Save the property

### 4. Register as Rentee
1. Create another account with "Rentee" role
2. Use a different email address

### 5. Assign Tenants (Landlord)
1. In landlord dashboard, find your property
2. Add tenant by their email address
3. Tenant will now see the property in their dashboard

### 6. Generate Bills (Landlord)
1. Click "Generate Bills" on any property
2. Bills will be created for all tenants

### 7. Pay Bills (Rentee)
1. Login to rentee dashboard
2. View your bills
3. Click "Mark Paid" to update payment status

## 🎨 UI/UX Features
- **Modern Design**: Clean, responsive interface with gradient backgrounds
- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Interactive Elements**: Hover effects and smooth transitions
- **Dashboard Cards**: Quick overview of key metrics with icons
- **Data Tables**: Sortable bill and property lists
- **Modal Forms**: Easy property and bill management
- **Status Indicators**: Color-coded bill status badges
- **Mobile Responsive**: Works on all devices
- **Loading States**: Beautiful loading animations
- **Navigation**: Consistent header with logout functionality

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Properties (Landlord)
- `POST /api/properties` - Create property
- `GET /api/properties/landlord` - Get landlord's properties
- `POST /api/properties/add-tenant` - Add tenant to property

### Properties (Rentee)
- `GET /api/properties/rentee` - Get rentee's properties

### Bills
- `POST /api/bills/generate` - Generate bills for property
- `GET /api/bills/landlord` - Get landlord's bills
- `GET /api/bills/tenant` - Get rentee's bills
- `PUT /api/bills/:id/paid` - Mark bill as paid
- `GET /api/bills/summary` - Get bill summary

## 🗄️ Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (landlord/rentee),
  phone: String,
  createdAt: Date
}
```

### Properties Collection
```javascript
{
  landlord: ObjectId (ref: User),
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  rentAmount: Number,
  tenants: [ObjectId] (ref: User),
  utilities: [{
    name: String,
    amount: Number,
    splitType: String (equal/custom),
    customSplit: [{
      tenant: ObjectId,
      percentage: Number
    }]
  }],
  createdAt: Date
}
```

### Bills Collection
```javascript
{
  property: ObjectId (ref: Property),
  tenant: ObjectId (ref: User),
  type: String (rent/utility),
  amount: Number,
  description: String,
  dueDate: Date,
  status: String (pending/paid/overdue),
  paidAt: Date,
  month: String (YYYY-MM),
  utilityName: String,
  splitPercentage: Number,
  createdAt: Date
}
```

## 📊 Build Outputs

After a successful build, you'll have:

```
z-Letly/
├── frontend/
│   └── dist/           # Production frontend build
├── api/                # Serverless functions (ready for deployment)
├── BUILD_SUMMARY.md    # Build information and next steps
└── vercel.json         # Vercel configuration
```

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

## 📋 Demo Credentials

**After deployment, seed demo data using:**
```bash
# Option 1: Using curl (replace with your Vercel URL)
curl -X POST https://your-app.vercel.app/api/seed-demo

# Option 2: Using the demo data script
cd api && node seed-demo-data.js
```

**Demo Credentials:**
- **Landlord**: `landlord@test.com` / `password123`
- **Rentee**: `rentee@test.com` / `password123`

**Demo Property**: Demo Apartment Complex
**Monthly Rent**: $1,500 + $300 utilities = $1,800

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

**Status**: ✅ **Production Ready** - MongoDB Atlas integrated with persistent data storage and beautiful modern UI!

**Happy Building! 🚀**
