#!/bin/bash

# Trading Signals Platform - Quick Start Script
# This script starts both backend and frontend servers

echo "🚀 Starting Trading Signals Platform..."
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   macOS: brew services start mongodb-community"
    echo "   Linux: sudo systemctl start mongod"
    echo "   Windows: Start MongoDB service from Services"
    exit 1
fi
echo "✅ MongoDB is running"
echo ""

# Start Backend
echo "🔧 Starting Backend Server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

npm start &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start Frontend
echo "🎨 Starting Frontend Server..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

npm start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "✨ Trading Signals Platform is running!"
echo ""
echo "📍 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "👤 Default Admin Credentials:"
echo "   Email:    admin@tradingsignals.com"
echo "   Password: Admin@123456"
echo ""
echo "⚠️  IMPORTANT: Change admin password after first login!"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
wait
