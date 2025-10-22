# Trading Signals Platform - Admin Guide

## Table of Contents
1. [Admin Access](#admin-access)
2. [Admin Dashboard](#admin-dashboard)
3. [Signal Management](#signal-management)
4. [User Management](#user-management)
5. [Subscription Management](#subscription-management)
6. [Best Practices](#best-practices)

## Admin Access

### Default Admin Credentials

When you first start the backend server, a default admin account is automatically created:

- **Email**: admin@tradingsignals.com
- **Password**: Admin@123456

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

### Changing Admin Password

1. Login with admin credentials
2. Click on your profile icon
3. Navigate to profile settings
4. Use the "Change Password" option
5. Enter current password and new password
6. Save changes

## Admin Dashboard

### Overview Statistics

The admin dashboard provides a comprehensive overview of platform metrics:

#### User Statistics
- **Total Users**: Total number of registered users
- **Active Subscribers**: Users with active subscriptions
- **Admin Users**: Number of admin accounts

#### Signal Statistics
- **Total Signals**: All signals created
- **Active Signals**: Currently active signals
- **Win Rate**: Percentage of signals that hit TP vs SL

### Quick Actions

The dashboard provides quick access to:
- Create new trading signals
- Manage user subscriptions
- View signal performance
- Monitor user activity

## Signal Management

### Creating a New Signal

#### Step 1: Access Signal Management
1. Navigate to "Signals" from the admin menu
2. Click "Create Signal" button

#### Step 2: Enter Signal Details

**Trading Pair**
- Enter the trading pair name (e.g., "US NAS 100", "EUR/USD", "Gold")
- Use clear, recognizable names
- Be consistent with naming conventions

**Signal Type**
- Select "Buy" or "Sell"
- Buy: Long position (profit when price goes up)
- Sell: Short position (profit when price goes down)

**Entry Price**
- Enter the current market price
- This is the recommended entry point for traders
- Use accurate, real-time pricing

#### Step 3: Calculate TP and SL

**Option A: Automatic Calculation**
1. Enter entry price
2. Set risk ratio (e.g., 1)
3. Set reward ratio (e.g., 2)
4. Click "Calculate TP & SL"
5. Enter risk percentage (default 2%)
6. System automatically calculates optimal TP and SL

**Option B: Manual Entry**
1. Enter take profit price manually
2. Enter stop loss price manually
3. Ensure prices are logical based on signal type

#### Step 4: Add Notes (Optional)
- Add any additional context or analysis
- Include market conditions
- Note any special considerations

#### Step 5: Create Signal
1. Review all details
2. Click "Create"
3. Signal is immediately broadcast to all subscribed users

### Risk/Reward Calculation Examples

#### Example 1: Buy Signal with 1:2 Ratio
- Entry Price: $100
- Risk Ratio: 1
- Reward Ratio: 2
- Risk Percentage: 2%

**Calculation:**
- Risk Amount: $100 × 2% = $2
- Stop Loss: $100 - ($2 × 1) = $98
- Take Profit: $100 + ($2 × 2) = $104

#### Example 2: Sell Signal with 3:1 Ratio
- Entry Price: $50
- Risk Ratio: 3
- Reward Ratio: 1
- Risk Percentage: 2%

**Calculation:**
- Risk Amount: $50 × 2% = $1
- Stop Loss: $50 + ($1 × 3) = $53
- Take Profit: $50 - ($1 × 1) = $49

### Editing Signals

1. Navigate to Signal Management
2. Find the signal you want to edit
3. Click the edit icon (pencil)
4. Modify any field
5. Click "Update"
6. Changes are broadcast to all users

### Updating Signal Status

Update signal status when:
- **Hit TP**: Price reaches take profit target
- **Hit SL**: Price hits stop loss
- **Cancelled**: Signal is no longer valid

### Deleting Signals

1. Find the signal to delete
2. Click the delete icon (trash)
3. Confirm deletion
4. Signal is permanently removed

⚠️ **Warning**: Deleted signals cannot be recovered!

## User Management

### Viewing Users

The user management page displays:
- User name and email
- Account role (User/Admin)
- Subscription type
- Subscription status
- Join date
- Action buttons

### Editing User Details

1. Click the edit icon next to a user
2. Modify available fields:
   - Name
   - Email
   - Role (User/Admin)
   - Subscription Type (None/Monthly/Yearly)
   - Subscription Status (Active/Expired/Cancelled)
3. Click "Update"

### Managing User Subscriptions

#### Activating a Subscription
1. Edit the user
2. Set Subscription Type to "Monthly" or "Yearly"
3. Set Subscription Status to "Active"
4. Save changes

#### Cancelling a Subscription
1. Edit the user
2. Set Subscription Status to "Cancelled"
3. Save changes

#### Expiring a Subscription
1. Edit the user
2. Set Subscription Status to "Expired"
3. Save changes

### Deleting Users

1. Click the delete icon next to a user
2. Confirm deletion
3. User and all associated data are removed

⚠️ **Warning**: This action cannot be undone!

### Creating Admin Users

1. Edit an existing user
2. Change Role to "Admin"
3. Save changes
4. User now has admin privileges

## Subscription Management

### Viewing All Subscriptions

Access subscription data from the admin panel to see:
- All active subscriptions
- Subscription history
- Revenue metrics
- Renewal dates

### Subscription Plans

#### Monthly Plan
- Price: $49.99 USD / €45.99 EUR / £39.99 GBP
- Duration: 30 days
- Auto-renewal: Optional

#### Yearly Plan
- Price: $499.99 USD / €459.99 EUR / £399.99 GBP
- Duration: 365 days
- Savings: 17%
- Auto-renewal: Optional

### Modifying Plan Prices

To change subscription prices:
1. Edit `backend/controllers/subscriptionController.js`
2. Update the `SUBSCRIPTION_PRICES` object
3. Restart the backend server

```javascript
const SUBSCRIPTION_PRICES = {
  monthly: {
    USD: 49.99,
    EUR: 45.99,
    GBP: 39.99
  },
  yearly: {
    USD: 499.99,
    EUR: 459.99,
    GBP: 399.99
  }
};
```

## Best Practices

### Signal Creation

1. **Accuracy First**: Always use current, accurate market prices
2. **Reasonable Ratios**: Use realistic risk/reward ratios (1:1 to 1:3 typically)
3. **Clear Naming**: Use consistent, clear trading pair names
4. **Timely Updates**: Update signal status promptly when TP or SL is hit
5. **Quality Over Quantity**: Focus on high-probability setups

### Risk Management

1. **Conservative Risk**: Default 2% risk is recommended
2. **Appropriate Stop Loss**: Ensure SL is at a logical technical level
3. **Realistic Targets**: TP should be achievable based on market conditions
4. **Document Reasoning**: Use notes field to explain signal logic

### User Management

1. **Regular Audits**: Review user list regularly
2. **Monitor Subscriptions**: Check for expired subscriptions
3. **Respond Promptly**: Address user issues quickly
4. **Maintain Security**: Limit admin access to trusted individuals
5. **Backup Data**: Regularly backup user and signal data

### Platform Maintenance

1. **Monitor Performance**: Check signal win rate regularly
2. **User Feedback**: Listen to subscriber feedback
3. **System Updates**: Keep software dependencies updated
4. **Database Backups**: Regular MongoDB backups
5. **Security Patches**: Apply security updates promptly

## Signal Quality Guidelines

### Entry Price
- Use real-time market prices
- Verify price accuracy before creating signal
- Consider market volatility

### Take Profit
- Based on technical analysis
- Realistic and achievable
- Consider market conditions
- Typically 1-3x the risk amount

### Stop Loss
- Below/above key support/resistance levels
- Appropriate for the timeframe
- Not too tight (avoid premature stops)
- Not too wide (excessive risk)

### Trading Pairs
- Focus on liquid markets
- Cover diverse asset classes
- Include popular pairs
- Consider user preferences

## Monitoring & Analytics

### Key Metrics to Track

1. **Win Rate**: Percentage of successful signals
   - Target: >60% for sustainable performance
   - Calculate: (Hit TP / (Hit TP + Hit SL)) × 100

2. **Active Subscribers**: Number of paying users
   - Monitor growth trends
   - Track retention rates

3. **Signal Volume**: Number of signals per day/week
   - Maintain consistent output
   - Quality over quantity

4. **User Engagement**: Active users vs total users
   - Track login frequency
   - Monitor dashboard usage

### Performance Optimization

1. **Signal Timing**: Create signals during active market hours
2. **Pair Selection**: Focus on high-demand trading pairs
3. **Communication**: Keep users informed of market conditions
4. **Support**: Provide excellent customer service

## Troubleshooting

### Common Issues

**Signals Not Broadcasting**
- Check Socket.IO connection
- Verify backend server is running
- Check for WebSocket errors in console

**Users Can't Access Signals**
- Verify subscription status is "Active"
- Check subscription end date
- Ensure user role is correct

**Database Connection Issues**
- Verify MongoDB is running
- Check connection string in .env
- Review MongoDB logs

**Authentication Problems**
- Verify JWT_SECRET is set
- Check token expiration settings
- Review authentication middleware

## Security Considerations

### Admin Account Security

1. **Strong Passwords**: Use complex, unique passwords
2. **Regular Changes**: Update passwords periodically
3. **Limited Access**: Only grant admin rights when necessary
4. **Activity Monitoring**: Review admin actions regularly
5. **Two-Factor Auth**: Consider implementing 2FA (future enhancement)

### Data Protection

1. **User Privacy**: Protect user personal information
2. **Payment Security**: Secure payment data handling
3. **Database Security**: Implement proper MongoDB security
4. **API Security**: Use HTTPS in production
5. **Regular Backups**: Maintain regular data backups

## Support & Maintenance

### Regular Tasks

**Daily**
- Monitor active signals
- Check for user issues
- Review new registrations

**Weekly**
- Analyze signal performance
- Review subscription renewals
- Check system health

**Monthly**
- Generate performance reports
- Review user feedback
- Plan improvements
- Database maintenance

### Getting Help

For technical issues:
- Review error logs
- Check documentation
- Contact development team

---

## Appendix: API Endpoints Reference

### Admin-Only Endpoints

**Signals**
- `POST /api/signals` - Create signal
- `PUT /api/signals/:id` - Update signal
- `DELETE /api/signals/:id` - Delete signal
- `POST /api/signals/calculate` - Calculate TP/SL
- `GET /api/signals/stats` - Get statistics

**Users**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

**Subscriptions**
- `GET /api/subscriptions/admin/all` - Get all subscriptions

---

Remember: With great power comes great responsibility. Use admin privileges wisely and always prioritize user experience and platform integrity.