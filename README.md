
#
TWO different backend setups:
backend/ directory - Traditional Express.js server (for Render) ## to be decommissioned
api/ directory - Vercel serverless functions (for Vercel)

## run local dev backend env
cd api
cat .env
npm run dev

node dev-server.js

curl http://localhost:3000


## test backend health
node simple-server.js &


## Test local env: 
curl http://localhost:3001



# Frontend
cd frontend && npm run dev

# Deploy to vercel
git push origin vercel-prod

## push demo data
  curl -X POST https://z-letly.vercel.app//api/seed-demo


vercel

# random generate the JWT_SECRET
# On Mac/Linux:
openssl rand -base64 32

# Or, using Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


# After deployment, seed demo data
curl -X POST https://your-domain.vercel.app/api/seed-demo

# Test login
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@landlord.com","password":"demo123"}'  


