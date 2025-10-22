# Trading Signals Platform

A professional, full-stack trading signals application with real-time signal delivery, subscription management, and comprehensive admin controls.

## 🚀 Features

### Frontend Features
- **User Authentication**: Secure login and registration system
- **Real-time Signals**: Live trading signals delivered via WebSocket
- **Subscription Management**: Monthly and yearly subscription plans with multiple currency support
- **Billing Dashboard**: Manage subscriptions, payment methods, and view billing history
- **Signal Filtering**: Filter signals by trading pair, type (buy/sell), and status
- **Responsive Design**: Mobile-friendly interface built with Material-UI
- **Multi-currency Support**: USD, EUR, and GBP payment options

### Backend Features
- **RESTful API**: Comprehensive API for all platform operations
- **Real-time Communication**: Socket.IO for instant signal delivery
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and user roles with different permissions
- **Subscription System**: Automated subscription management with status tracking
- **Signal Management**: Create, update, and delete trading signals
- **Risk/Reward Calculator**: Automatic TP and SL calculation based on risk ratios
- **User Management**: Admin tools for managing users and subscriptions

### Admin Panel Features
- **Dashboard**: Overview of platform statistics and metrics
- **Signal Creation**: Create signals with automatic TP/SL calculation
- **User Management**: View, edit, and manage user accounts
- **Subscription Control**: Manage user subscriptions and access
- **Analytics**: Track signal performance and win rates

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd trading-signals-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if not running)
# mongod --dbpath /path/to/data

# Start the backend server
npm start
# or for development with auto-reload
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API URL

# Start the frontend development server
npm start
```

## 🔧 Configuration

### Backend Environment Variables (.env)

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

### Frontend Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 👤 Default Admin Credentials

After starting the backend for the first time, a default admin account is created:

- **Email**: admin@tradingsignals.com
- **Password**: Admin@123456

⚠️ **Important**: Change these credentials immediately after first login!

## 📱 Usage

### User Flow

1. **Register**: Create a new account at `/register`
2. **Subscribe**: Choose a subscription plan (Monthly or Yearly)
3. **Dashboard**: View real-time trading signals
4. **Manage Billing**: Update payment methods and subscriptions

### Admin Flow

1. **Login**: Use admin credentials
2. **Admin Dashboard**: View platform statistics
3. **Create Signals**: 
   - Select trading pair (e.g., US NAS 100)
   - Choose Buy or Sell
   - Enter entry price
   - Set risk/reward ratio (e.g., 1:2, 3:1)
   - Calculate TP and SL automatically
4. **Manage Users**: View and edit user accounts and subscriptions

## 🏗️ Project Structure

```
trading-signals-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── signalController.js   # Signal management
│   │   ├── subscriptionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Signal.js             # Signal schema
│   │   └── Subscription.js       # Subscription schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── signals.js
│   │   ├── subscriptions.js
│   │   └── users.js
│   ├── .env
│   ├── package.json
│   └── server.js                 # Main server file
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx        # Main layout with navigation
│   │   │   └── PrivateRoute.tsx  # Protected route component
│   │   ├── config/
│   │   │   ├── api.ts            # Axios configuration
│   │   │   └── socket.ts         # Socket.IO configuration
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Subscription.tsx
│   │   │   ├── Billing.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── SignalManagement.tsx
│   │   │       └── UserManagement.tsx
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Signals (Requires Active Subscription)
- `GET /api/signals` - Get all signals
- `GET /api/signals/:id` - Get single signal
- `POST /api/signals` - Create signal (Admin only)
- `PUT /api/signals/:id` - Update signal (Admin only)
- `DELETE /api/signals/:id` - Delete signal (Admin only)
- `POST /api/signals/calculate` - Calculate TP/SL (Admin only)
- `GET /api/signals/stats` - Get signal statistics (Admin only)

### Subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/my-subscriptions` - Get user subscriptions
- `GET /api/subscriptions/current` - Get current subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription
- `PUT /api/subscriptions/payment-method` - Update payment method
- `GET /api/subscriptions/admin/all` - Get all subscriptions (Admin only)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- CORS configuration
- Input validation
- Secure password requirements

## 📊 Subscription Plans

### Monthly Plan
- Duration: 1 month
- Prices: $49.99 USD / €45.99 EUR / £39.99 GBP
- Features:
  - Real-time trading signals
  - All trading pairs
  - Entry, TP, and SL prices
  - Email notifications
  - Mobile access

### Yearly Plan
- Duration: 12 months
- Prices: $499.99 USD / €459.99 EUR / £399.99 GBP
- Savings: 17% compared to monthly
- Additional Features:
  - Priority support
  - Advanced analytics

## 🎨 Design Features

- Modern gradient UI design
- Material-UI components
- Responsive layout for all devices
- Real-time updates via WebSocket
- Smooth animations and transitions
- Professional color scheme
- Intuitive navigation

## 🚦 Signal Status Types

- **Active**: Signal is currently active
- **Hit TP**: Take profit target reached
- **Hit SL**: Stop loss triggered
- **Cancelled**: Signal cancelled by admin

## 💡 Risk/Reward Calculation

The platform includes an automatic TP/SL calculator:

1. Enter entry price
2. Set risk ratio (e.g., 1)
3. Set reward ratio (e.g., 2)
4. Set risk percentage (default 2%)
5. System calculates optimal TP and SL prices

Example for BUY signal:
- Entry: $100
- Risk: 1, Reward: 2
- Risk %: 2%
- Result: SL = $98, TP = $104

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### CORS Errors
- Ensure FRONTEND_URL in backend .env matches your frontend URL
- Check that both servers are running

## 📝 License

This project is licensed under the ISC License.

## 👥 Support

For support, email support@tradingsignals.com or create an issue in the repository.

## 🔄 Future Enhancements

- Email notifications for new signals
- SMS alerts
- Mobile app (iOS/Android)
- Advanced charting
- Signal performance analytics
- Multiple admin roles
- Payment gateway integration (Stripe/PayPal)
- Multi-language support
- Dark mode
- Export signal history
- API webhooks

## 🙏 Acknowledgments

- Material-UI for the component library
- Socket.IO for real-time communication
- MongoDB for the database
- Express.js for the backend framework
- React for the frontend framework