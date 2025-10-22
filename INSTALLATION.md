# Trading Signals Platform - Installation Guide

## Quick Start Guide

This guide will help you set up and run the Trading Signals Platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **MongoDB** (v4.4 or higher)
  - Download from: https://www.mongodb.com/try/download/community
  - Verify installation: `mongod --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

## Installation Steps

### Step 1: Install MongoDB

#### On macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

#### On Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### On Windows
1. Download MongoDB installer from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a service
5. MongoDB will start automatically

#### Verify MongoDB is Running
```bash
# Check if MongoDB is running
mongosh
# or
mongo

# You should see MongoDB shell prompt
# Type 'exit' to quit
```

### Step 2: Clone or Extract the Project

If you have the project as a zip file:
```bash
unzip trading-signals-platform.zip
cd trading-signals-platform
```

If cloning from repository:
```bash
git clone <repository-url>
cd trading-signals-platform
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your settings (optional for local development)
# The default settings should work for local development

# Start the backend server
npm start
```

The backend server will start on http://localhost:5000

**Expected Output:**
```
Server running in development mode on port 5000
MongoDB Connected: localhost
Default admin user created
```

### Step 4: Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# The default settings should work for local development

# Start the frontend development server
npm start
```

The frontend will automatically open in your browser at http://localhost:3000

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## Accessing the Application

### User Access
1. Open your browser and go to http://localhost:3000
2. Click "Sign Up" to create a new account
3. Fill in your details and register
4. Choose a subscription plan
5. Access the dashboard to view signals

### Admin Access
1. Go to http://localhost:3000/login
2. Use the default admin credentials:
   - **Email**: admin@tradingsignals.com
   - **Password**: Admin@123456
3. You'll be redirected to the dashboard
4. Access admin features from the navigation menu

⚠️ **IMPORTANT**: Change the admin password immediately after first login!

## Verifying Installation

### Check Backend
```bash
# Test backend health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### Check Frontend
1. Open http://localhost:3000 in your browser
2. You should see the login page
3. No console errors should appear

### Check MongoDB
```bash
# Connect to MongoDB
mongosh

# Switch to trading signals database
use trading-signals

# Check collections
show collections

# You should see: users, signals, subscriptions

# Check admin user exists
db.users.findOne({role: 'admin'})

# Exit MongoDB shell
exit
```

## Common Installation Issues

### Issue: MongoDB Connection Failed

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list  # macOS

# Start MongoDB if not running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Issue: Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change the port in backend/.env
PORT=5001
```

### Issue: npm Install Fails

**Error**: Various npm errors during installation

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Issue: Frontend Won't Start

**Error**: `Module not found` or compilation errors

**Solution**:
```bash
# Make sure you're in the frontend directory
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Start again
npm start
```

### Issue: CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check that backend is running on port 5000
2. Check that frontend is running on port 3000
3. Verify FRONTEND_URL in backend/.env is set to http://localhost:3000
4. Restart both servers

## Development Mode

### Running Backend in Development Mode
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Running Frontend in Development Mode
```bash
cd frontend
npm start  # Already in development mode with hot reload
```

## Production Build

### Building Frontend for Production
```bash
cd frontend
npm run build

# This creates an optimized production build in the 'build' folder
```

### Running Backend in Production
```bash
cd backend

# Set environment to production in .env
NODE_ENV=production

# Start server
npm start
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/trading-signals
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@tradingsignals.com
ADMIN_PASSWORD=Admin@123456
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Testing the Application

### Test User Registration
1. Go to http://localhost:3000/register
2. Create a new account
3. Verify you're redirected to subscription page

### Test Admin Functions
1. Login as admin
2. Navigate to Admin > Signals
3. Create a test signal
4. Verify it appears in the dashboard

### Test Real-time Updates
1. Open two browser windows
2. Login as admin in one, user in another
3. Create a signal as admin
4. Verify it appears immediately in user dashboard

## Next Steps

After successful installation:

1. **Change Admin Password**: Login as admin and change the default password
2. **Create Test Signals**: Create a few test signals to familiarize yourself
3. **Test Subscriptions**: Create a test user and subscribe to a plan
4. **Read Documentation**: Review USER_GUIDE.md and ADMIN_GUIDE.md
5. **Customize**: Modify branding, colors, and content as needed

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the error messages in terminal/console
3. Check MongoDB logs: `tail -f /var/log/mongodb/mongod.log`
4. Review backend logs in the terminal
5. Check browser console for frontend errors

## Useful Commands

```bash
# Check if ports are in use
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# View MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod  # Linux
brew services restart mongodb-community  # macOS

# Clear all data (reset database)
mongosh
use trading-signals
db.dropDatabase()
exit
```

## System Requirements

### Minimum Requirements
- CPU: 2 cores
- RAM: 4 GB
- Storage: 10 GB free space
- OS: Windows 10, macOS 10.14+, Ubuntu 18.04+

### Recommended Requirements
- CPU: 4 cores
- RAM: 8 GB
- Storage: 20 GB free space
- OS: Latest version of Windows, macOS, or Ubuntu

## Support

For additional help:
- Email: support@tradingsignals.com
- Documentation: See README.md, USER_GUIDE.md, ADMIN_GUIDE.md

---

Congratulations! You should now have a fully functional Trading Signals Platform running locally. 🎉