# Trading Signals Platform - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will get you up and running quickly.

## Prerequisites

- Node.js installed (v14+)
- MongoDB installed and running

## Step 1: Install MongoDB

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Ubuntu/Linux
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Windows
Download and install from: https://www.mongodb.com/try/download/community

## Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 3: Configure Environment

```bash
# Backend - use default .env (already configured)
cd backend
# .env file is already set up with default values

# Frontend - use default .env (already configured)
cd ../frontend
# .env file is already set up with default values
```

## Step 4: Start the Application

### Option A: Using the start script (Recommended)
```bash
# From project root
./start.sh
```

### Option B: Manual start
```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm start
```

## Step 5: Access the Application

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:5000

## Step 6: Login as Admin

Use these default credentials:
- **Email**: admin@tradingsignals.com
- **Password**: Admin@123456

⚠️ **Change the password immediately after first login!**

## What's Next?

### As Admin:
1. Go to Admin > Signals
2. Click "Create Signal"
3. Fill in the details:
   - Trading Pair: "US NAS 100"
   - Type: Buy
   - Entry Price: 15000
   - Risk Ratio: 1
   - Reward Ratio: 2
4. Click "Calculate TP & SL"
5. Click "Create"

### As User:
1. Click "Sign Up"
2. Create a new account
3. Choose a subscription plan
4. View signals in the dashboard

## Common Issues

### MongoDB not running?
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows
Start MongoDB service from Services
```

### Port already in use?
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Dependencies not installing?
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

- See **INSTALLATION.md** for detailed setup
- See **USER_GUIDE.md** for user documentation
- See **ADMIN_GUIDE.md** for admin documentation
- See **README.md** for complete documentation

## Features Overview

✅ Real-time trading signals
✅ User authentication
✅ Subscription management
✅ Admin panel
✅ Signal filtering
✅ Multi-currency support
✅ Responsive design
✅ Risk/reward calculator

## Project Structure

```
trading-signals-platform/
├── backend/          # Node.js API server
├── frontend/         # React application
├── docs/            # Documentation
└── README.md        # Main documentation
```

## Default Ports

- Frontend: 3000
- Backend: 5000
- MongoDB: 27017

## Environment Files

Both `.env` files are pre-configured with default values for local development. No changes needed to get started!

---

**That's it! You're ready to go!** 🎉

For more detailed information, see the complete documentation in README.md.