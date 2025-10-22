import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Add, Edit, Delete, Calculate } from '@mui/icons-material';
import api from '../../config/api';
import { format } from 'date-fns';

interface Signal {
  _id: string;
  tradingPair: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  status: string;
  createdAt: string;
  riskRewardRatio?: {
    risk: number;
    reward: number;
  };
}

const SignalManagement: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [calcDialogOpen, setCalcDialogOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    tradingPair: '',
    type: 'buy',
    entryPrice: '',
    takeProfit: '',
    stopLoss: '',
    riskRatio: '1',
    rewardRatio: '2',
    riskPercentage: '2',
    notes: '',
  });
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const response = await api.get('/signals', { params: { limit: 100 } });
      setSignals(response.data.signals);
    } catch (err: any) {
      setError('Failed to fetch signals');
    }
  };

  const handleCalculate = async () => {
    try {
      const response = await api.post('/signals/calculate', {
        entryPrice: parseFloat(formData.entryPrice),
        type: formData.type,
        riskRatio: parseFloat(formData.riskRatio),
        rewardRatio: parseFloat(formData.rewardRatio),
        riskPercentage: parseFloat(formData.riskPercentage),
      });
      setCalculation(response.data.calculation);
      setFormData({
        ...formData,
        takeProfit: response.data.calculation.takeProfit.toString(),
        stopLoss: response.data.calculation.stopLoss.toString(),
      });
      setCalcDialogOpen(false);
    } catch (err: any) {
      setError('Calculation failed');
    }
  };

  const handleSubmit = async () => {
    try {
      const signalData = {
        tradingPair: formData.tradingPair,
        type: formData.type,
        entryPrice: parseFloat(formData.entryPrice),
        takeProfit: parseFloat(formData.takeProfit),
        stopLoss: parseFloat(formData.stopLoss),
        riskRewardRatio: {
          risk: parseFloat(formData.riskRatio),
          reward: parseFloat(formData.rewardRatio),
        },
        notes: formData.notes,
      };

      if (editingSignal) {
        await api.put(`/signals/${editingSignal._id}`, signalData);
        setSuccess('Signal updated successfully');
      } else {
        await api.post('/signals', signalData);
        setSuccess('Signal created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchSignals();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save signal');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this signal?')) return;

    try {
      await api.delete(`/signals/${id}`);
      setSuccess('Signal deleted successfully');
      fetchSignals();
    } catch (err: any) {
      setError('Failed to delete signal');
    }
  };

  const handleEdit = (signal: Signal) => {
    setEditingSignal(signal);
    setFormData({
      tradingPair: signal.tradingPair,
      type: signal.type,
      entryPrice: signal.entryPrice.toString(),
      takeProfit: signal.takeProfit.toString(),
      stopLoss: signal.stopLoss.toString(),
      riskRatio: signal.riskRewardRatio?.risk.toString() || '1',
      rewardRatio: signal.riskRewardRatio?.reward.toString() || '2',
      riskPercentage: '2',
      notes: '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      tradingPair: '',
      type: 'buy',
      entryPrice: '',
      takeProfit: '',
      stopLoss: '',
      riskRatio: '1',
      rewardRatio: '2',
      riskPercentage: '2',
      notes: '',
    });
    setEditingSignal(null);
    setCalculation(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Signal Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage trading signals
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          Create Signal
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={2}>
        {signals.map((signal) => (
          <Grid item xs={12} md={6} lg={4} key={signal._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {signal.tradingPair}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(signal)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(signal._id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={signal.type.toUpperCase()}
                    color={signal.type === 'buy' ? 'success' : 'error'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={signal.status.replace('_', ' ').toUpperCase()}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Entry
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ${signal.entryPrice.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      TP
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      ${signal.takeProfit.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      SL
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="error.main">
                      ${signal.stopLoss.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  {format(new Date(signal.createdAt), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Signal Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSignal ? 'Edit Signal' : 'Create New Signal'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Trading Pair"
              value={formData.tradingPair}
              onChange={(e) => setFormData({ ...formData, tradingPair: e.target.value })}
              placeholder="e.g., US NAS 100, EUR/USD"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Signal Type</InputLabel>
              <Select
                value={formData.type}
                label="Signal Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="buy">Buy</MenuItem>
                <MenuItem value="sell">Sell</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Entry Price"
              type="number"
              value={formData.entryPrice}
              onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Risk Ratio"
                type="number"
                value={formData.riskRatio}
                onChange={(e) => setFormData({ ...formData, riskRatio: e.target.value })}
              />
              <TextField
                fullWidth
                label="Reward Ratio"
                type="number"
                value={formData.rewardRatio}
                onChange={(e) => setFormData({ ...formData, rewardRatio: e.target.value })}
              />
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Calculate />}
              onClick={() => setCalcDialogOpen(true)}
              sx={{ mb: 2 }}
            >
              Calculate TP & SL
            </Button>

            <TextField
              fullWidth
              label="Take Profit"
              type="number"
              value={formData.takeProfit}
              onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Stop Loss"
              type="number"
              value={formData.stopLoss}
              onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSignal ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calculate Dialog */}
      <Dialog open={calcDialogOpen} onClose={() => setCalcDialogOpen(false)}>
        <DialogTitle>Calculate TP & SL</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Risk Percentage"
              type="number"
              value={formData.riskPercentage}
              onChange={(e) => setFormData({ ...formData, riskPercentage: e.target.value })}
              helperText="Percentage of entry price to risk"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalcDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCalculate} variant="contained">
            Calculate
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SignalManagement;