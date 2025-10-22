const express = require('express');
const router = express.Router();
const {
  getSignals,
  getSignal,
  createSignal,
  updateSignal,
  deleteSignal,
  calculateSignal,
  getSignalStats
} = require('../controllers/signalController');
const { protect, authorize, checkSubscription } = require('../middleware/auth');

// Public calculation endpoint for admins
router.post('/calculate', protect, authorize('admin'), calculateSignal);

// Stats endpoint
router.get('/stats', protect, authorize('admin'), getSignalStats);

// Protected routes - require active subscription
router.get('/', protect, checkSubscription, getSignals);
router.get('/:id', protect, checkSubscription, getSignal);

// Admin only routes
router.post('/', protect, authorize('admin'), createSignal);
router.put('/:id', protect, authorize('admin'), updateSignal);
router.delete('/:id', protect, authorize('admin'), deleteSignal);

module.exports = router;