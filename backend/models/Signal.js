const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
  tradingPair: {
    type: String,
    required: [true, 'Please provide a trading pair'],
    trim: true
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: [true, 'Please specify signal type']
  },
  entryPrice: {
    type: Number,
    required: [true, 'Please provide entry price']
  },
  takeProfit: {
    type: Number,
    required: [true, 'Please provide take profit price']
  },
  stopLoss: {
    type: Number,
    required: [true, 'Please provide stop loss price']
  },
  riskRewardRatio: {
    risk: Number,
    reward: Number
  },
  status: {
    type: String,
    enum: ['active', 'hit_tp', 'hit_sl', 'cancelled'],
    default: 'active'
  },
  currentPrice: Number,
  profitLoss: Number,
  profitLossPercentage: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  closedAt: Date,
  notes: String
});

// Update timestamp on save
signalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate profit/loss
signalSchema.methods.calculateProfitLoss = function(currentPrice) {
  this.currentPrice = currentPrice;
  
  if (this.type === 'buy') {
    this.profitLoss = currentPrice - this.entryPrice;
    this.profitLossPercentage = ((currentPrice - this.entryPrice) / this.entryPrice) * 100;
  } else {
    this.profitLoss = this.entryPrice - currentPrice;
    this.profitLossPercentage = ((this.entryPrice - currentPrice) / this.entryPrice) * 100;
  }
  
  return {
    profitLoss: this.profitLoss,
    profitLossPercentage: this.profitLossPercentage
  };
};

module.exports = mongoose.model('Signal', signalSchema);