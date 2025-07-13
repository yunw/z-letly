
#
TWO different backend setups:
backend/ directory - Traditional Express.js server (for Render) ## to be decommissioned
api/ directory - Vercel serverless functions (for Vercel)

## run local dev backend env
cd api
cat .env
node simple-server.js &


## Test local env: 
curl http://localhost:3001



# Frontend
cd frontend && npm run dev



