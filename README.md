
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

  curl -X POST https://your-vercel-domain.vercel.app/api/seed-demo


