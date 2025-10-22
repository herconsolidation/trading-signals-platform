const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Subscription pricing
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

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
exports.getPlans = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      plans: {
        monthly: {
          name: 'Monthly Plan',
          duration: '1 month',
          prices: SUBSCRIPTION_PRICES.monthly,
          features: [
            'Real-time trading signals',
            'All trading pairs',
            'Entry, TP, and SL prices',
            'Email notifications',
            'Mobile access'
          ]
        },
        yearly: {
          name: 'Yearly Plan',
          duration: '12 months',
          prices: SUBSCRIPTION_PRICES.yearly,
          savings: '17% savings',
          features: [
            'Real-time trading signals',
            'All trading pairs',
            'Entry, TP, and SL prices',
            'Email notifications',
            'Mobile access',
            'Priority support',
            'Advanced analytics'
          ]
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create subscription
// @route   POST /api/subscriptions
// @access  Private
exports.createSubscription = async (req, res) => {
  try {
    const { plan, currency = 'USD', paymentMethod } = req.body;

    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    const amount = SUBSCRIPTION_PRICES[plan][currency];
    const startDate = new Date();
    const endDate = new Date();

    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create subscription record
    const subscription = await Subscription.create({
      user: req.user.id,
      plan,
      status: 'active',
      amount,
      currency,
      startDate,
      endDate,
      paymentMethod,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // Update user subscription
    const user = await User.findById(req.user.id);
    user.subscription = {
      type: plan,
      status: 'active',
      startDate,
      endDate,
      autoRenew: true
    };
    user.paymentMethod = {
      currency,
      lastFour: paymentMethod?.lastFour || '****',
      brand: paymentMethod?.brand || 'card'
    };
    await user.save();

    res.status(201).json({
      success: true,
      subscription,
      message: 'Subscription created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user subscriptions
// @route   GET /api/subscriptions/my-subscriptions
// @access  Private
exports.getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current subscription
// @route   GET /api/subscriptions/current
// @access  Private
exports.getCurrentSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      subscription: user.subscription,
      paymentMethod: user.paymentMethod
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Private
exports.updateSubscription = async (req, res) => {
  try {
    const { autoRenew } = req.body;

    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (autoRenew !== undefined) {
      subscription.autoRenew = autoRenew;
      await subscription.save();

      // Update user subscription
      const user = await User.findById(req.user.id);
      user.subscription.autoRenew = autoRenew;
      await user.save();
    }

    res.status(200).json({
      success: true,
      subscription,
      message: 'Subscription updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    // Update user subscription
    const user = await User.findById(req.user.id);
    user.subscription.status = 'cancelled';
    user.subscription.autoRenew = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payment method
// @route   PUT /api/subscriptions/payment-method
// @access  Private
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { currency, lastFour, brand } = req.body;

    const user = await User.findById(req.user.id);
    
    user.paymentMethod = {
      currency: currency || user.paymentMethod.currency,
      lastFour: lastFour || user.paymentMethod.lastFour,
      brand: brand || user.paymentMethod.brand
    };
    
    await user.save();

    res.status(200).json({
      success: true,
      paymentMethod: user.paymentMethod,
      message: 'Payment method updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all subscriptions (Admin)
// @route   GET /api/subscriptions/admin/all
// @access  Private (Admin only)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};