const Signal = require('../models/Signal');

// @desc    Get all signals
// @route   GET /api/signals
// @access  Private (Subscribed users only)
exports.getSignals = async (req, res) => {
  try {
    const { tradingPair, status, startDate, endDate, limit = 50 } = req.query;

    let query = {};

    if (tradingPair) {
      query.tradingPair = tradingPair;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const signals = await Signal.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: signals.length,
      signals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get signal by ID
// @route   GET /api/signals/:id
// @access  Private (Subscribed users only)
exports.getSignal = async (req, res) => {
  try {
    const signal = await Signal.findById(req.params.id).populate('createdBy', 'name email');

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found'
      });
    }

    res.status(200).json({
      success: true,
      signal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new signal
// @route   POST /api/signals
// @access  Private (Admin only)
exports.createSignal = async (req, res) => {
  try {
    const {
      tradingPair,
      type,
      entryPrice,
      takeProfit,
      stopLoss,
      riskRewardRatio,
      notes
    } = req.body;

    const signal = await Signal.create({
      tradingPair,
      type,
      entryPrice,
      takeProfit,
      stopLoss,
      riskRewardRatio,
      notes,
      createdBy: req.user.id
    });

    // Emit signal to all connected clients via Socket.IO
    if (req.app.get('io')) {
      req.app.get('io').emit('newSignal', signal);
    }

    res.status(201).json({
      success: true,
      signal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update signal
// @route   PUT /api/signals/:id
// @access  Private (Admin only)
exports.updateSignal = async (req, res) => {
  try {
    let signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found'
      });
    }

    signal = await Signal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Emit update to all connected clients
    if (req.app.get('io')) {
      req.app.get('io').emit('signalUpdated', signal);
    }

    res.status(200).json({
      success: true,
      signal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete signal
// @route   DELETE /api/signals/:id
// @access  Private (Admin only)
exports.deleteSignal = async (req, res) => {
  try {
    const signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: 'Signal not found'
      });
    }

    await signal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Signal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Calculate signal with risk/reward ratio
// @route   POST /api/signals/calculate
// @access  Private (Admin only)
exports.calculateSignal = async (req, res) => {
  try {
    const { entryPrice, type, riskRatio, rewardRatio, riskPercentage } = req.body;

    if (!entryPrice || !type || !riskRatio || !rewardRatio) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const riskPercent = riskPercentage || 2; // Default 2% risk
    const riskAmount = (entryPrice * riskPercent) / 100;

    let stopLoss, takeProfit;

    if (type === 'buy') {
      stopLoss = entryPrice - (riskAmount * riskRatio);
      takeProfit = entryPrice + (riskAmount * rewardRatio);
    } else {
      stopLoss = entryPrice + (riskAmount * riskRatio);
      takeProfit = entryPrice - (riskAmount * rewardRatio);
    }

    res.status(200).json({
      success: true,
      calculation: {
        entryPrice,
        stopLoss: parseFloat(stopLoss.toFixed(2)),
        takeProfit: parseFloat(takeProfit.toFixed(2)),
        riskAmount: parseFloat(riskAmount.toFixed(2)),
        riskRewardRatio: `${riskRatio}:${rewardRatio}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get signals statistics
// @route   GET /api/signals/stats
// @access  Private (Admin only)
exports.getSignalStats = async (req, res) => {
  try {
    const totalSignals = await Signal.countDocuments();
    const activeSignals = await Signal.countDocuments({ status: 'active' });
    const hitTP = await Signal.countDocuments({ status: 'hit_tp' });
    const hitSL = await Signal.countDocuments({ status: 'hit_sl' });

    const winRate = totalSignals > 0 ? ((hitTP / (hitTP + hitSL)) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalSignals,
        activeSignals,
        hitTP,
        hitSL,
        winRate: parseFloat(winRate)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};