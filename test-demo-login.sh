#!/bin/bash

# Test Demo Login Script
echo "🧪 Testing Demo Login..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get Vercel URL from user
echo -e "${BLUE}Enter your Vercel URL (e.g., https://your-app.vercel.app):${NC}"
read VERCEL_URL

if [ -z "$VERCEL_URL" ]; then
    echo -e "${RED}❌ No URL provided${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🌱 Seeding demo data...${NC}"

# Seed demo data
SEED_RESPONSE=$(curl -s -X POST "$VERCEL_URL/api/seed-demo")

if echo "$SEED_RESPONSE" | grep -q "Demo data seeded successfully"; then
    echo -e "${GREEN}✅ Demo data seeded successfully!${NC}"
else
    echo -e "${RED}❌ Failed to seed demo data${NC}"
    echo "Response: $SEED_RESPONSE"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔐 Testing demo login...${NC}"

# Test landlord login
LANDLORD_RESPONSE=$(curl -s -X POST "$VERCEL_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"landlord@test.com","password":"password123"}')

if echo "$LANDLORD_RESPONSE" | grep -q "Login successful"; then
    echo -e "${GREEN}✅ Landlord login successful!${NC}"
else
    echo -e "${RED}❌ Landlord login failed${NC}"
    echo "Response: $LANDLORD_RESPONSE"
fi

# Test rentee login
RENTEE_RESPONSE=$(curl -s -X POST "$VERCEL_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"rentee@test.com","password":"password123"}')

if echo "$RENTEE_RESPONSE" | grep -q "Login successful"; then
    echo -e "${GREEN}✅ Rentee login successful!${NC}"
else
    echo -e "${RED}❌ Rentee login failed${NC}"
    echo "Response: $RENTEE_RESPONSE"
fi

echo ""
echo -e "${GREEN}🎉 Demo testing completed!${NC}"
echo ""
echo -e "${BLUE}📋 Demo Credentials:${NC}"
echo "Landlord: landlord@test.com / password123"
echo "Rentee: rentee@test.com / password123"
echo ""
echo -e "${BLUE}🌐 Visit your app: $VERCEL_URL${NC}" 