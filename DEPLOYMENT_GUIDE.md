# Deployment Guide for z-Letly

## Backend Deployment (Render)

Your backend is already deployed at: `https://letly-ouqc.onrender.com/`

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy to Netlify

1. **Build for production**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Drag and drop** the `dist` folder to Netlify dashboard

### Option 3: Deploy to GitHub Pages

1. **Add to package.json** (in frontend directory):
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

## Environment Configuration

The frontend automatically detects the environment:

- **Development**: Uses `http://localhost:8080`
- **Production**: Uses `https://letly-ouqc.onrender.com`

### Manual Environment Override

If you need to override the environment, you can:

1. **Set NODE_ENV**:
   ```bash
   export NODE_ENV=production
   npm run build
   ```

2. **Or modify the config** in `frontend/src/config/api.js`:
   ```javascript
   export const API_BASE_URL = 'https://letly-ouqc.onrender.com';
   ```

## Testing the Deployment

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Test locally**:
   ```bash
   npm run preview
   ```

3. **Verify API calls**:
   - Open browser dev tools
   - Check Network tab
   - Verify API calls go to `https://letly-ouqc.onrender.com`

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend has the correct CORS configuration:

```javascript
// In your backend app.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

### Environment Variables
For advanced deployments, you can use environment variables:

```bash
# Create .env file in frontend directory
VITE_API_URL=https://letly-ouqc.onrender.com
```

Then update `frontend/src/config/api.js`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

## Quick Deploy Commands

```bash
# Build and deploy to Vercel
cd frontend
npm run build
vercel --prod

# Or for Netlify
cd frontend
npm run build
# Then upload dist/ folder to Netlify
```

Your frontend will now connect to your deployed backend at `https://letly-ouqc.onrender.com/`! 