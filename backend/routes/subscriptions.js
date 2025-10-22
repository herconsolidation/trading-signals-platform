const express = require('express');
const router = express.Router();
const {
  getPlans,
  createSubscription,
  getMySubscriptions,
  getCurrentSubscription,
  updateSubscription,
  cancelSubscription,
  updatePaymentMethod,
  getAllSubscriptions
} = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.post('/', protect, createSubscription);
router.get('/my-subscriptions', protect, getMySubscriptions);
router.get('/current', protect, getCurrentSubscription);
router.put('/:id', protect, updateSubscription);
router.delete('/:id', protect, cancelSubscription);
router.put('/payment-method', protect, updatePaymentMethod);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllSubscriptions);

module.exports = router;