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
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcrypt

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd z-Letly

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start the servers
cd ../backend && npm run dev
cd ../frontend && npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

## 🎮 How to Use

### 1. Explore the Landing Page
1. Visit http://localhost:5173
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

## 🔄 Next Steps (Production Ready)
1. **Email Notifications**: Send bill reminders
2. **Payment Integration**: Connect to payment processors
3. **File Uploads**: Allow document attachments
4. **Advanced Splitting**: Custom utility split percentages
5. **Reporting**: Generate financial reports
6. **Multi-tenancy**: Support multiple landlords
7. **API Rate Limiting**: Protect against abuse
8. **Data Backup**: Automated MongoDB backups

## 🐛 Testing
The application is fully functional with MongoDB Atlas. All data is persisted in the cloud database.

**Test the complete flow:**
1. Visit the landing page → Explore features → Register as landlord → Add property → Generate bills
2. Register as rentee → View bills → Mark as paid
3. Check landlord dashboard for updated payment status
4. Data persists between sessions and server restarts

## 📱 Screenshots
- **Landing Page**: Modern marketing page with feature showcase
- **Landlord Dashboard**: Property management and bill overview with stats cards
- **Rentee Dashboard**: Bill viewing and payment tracking with summary metrics
- **Login/Register**: Clean authentication forms with demo credentials
- **Responsive Design**: Works on mobile and desktop with beautiful gradients

---

**Status**: ✅ **Production Ready** - MongoDB Atlas integrated with persistent data storage and beautiful modern UI!




### 📋 Demo Credentials
**After deployment, seed demo data using:**
```bash
# Option 1: Using curl (replace with your Vercel URL)
curl -X POST https://your-app.vercel.app/api/seed-demo

# Option 2: Using the demo data script
cd api && node seed-demo-data.js
```

**Demo Credentials:**
- **Landlord**: landlord@test.com / password123
- **Rentee**: rentee@test.com / password123

**Demo Property**: Demo Apartment Complex
**Monthly Rent**: $1,500 + $300 utilities = $1,800

## 🚀 Quick Start

### Development
```bash
# Start frontend (development)
cd frontend && npm run dev

# Start backend (development)
cd backend && npm start
```

### Production Deployment
<!-- Your backend is deployed at: `https://letly-ouqc.onrender.com/` -->

To deploy the frontend:
```bash
# Build for production
cd frontend && npm run build

# Deploy to Vercel (recommended)
vercel --prod

# Or deploy to Netlify
# Upload the dist/ folder to Netlify dashboard
```

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.