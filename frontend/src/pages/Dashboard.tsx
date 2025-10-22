import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Notifications,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { getSocket } from '../config/socket';
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

const Dashboard: React.FC = () => {
  const { user, hasActiveSubscription } = useAuth();
  const navigate = useNavigate();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasActiveSubscription) {
      navigate('/subscription');
      return;
    }

    fetchSignals();
    setupSocketListeners();

    return () => {
      const socket = getSocket();
      socket.off('newSignal');
      socket.off('signalUpdated');
    };
  }, [hasActiveSubscription, navigate]);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/signals', {
        params: { limit: 50 },
      });
      setSignals(response.data.signals);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch signals');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    const socket = getSocket();

    socket.on('newSignal', (signal: Signal) => {
      setSignals((prev) => [signal, ...prev]);
    });

    socket.on('signalUpdated', (updatedSignal: Signal) => {
      setSignals((prev) =>
        prev.map((signal) =>
          signal._id === updatedSignal._id ? updatedSignal : signal
        )
      );
    });
  };

  const filteredSignals = signals.filter((signal) => {
    if (filter === 'all') return true;
    if (filter === 'active') return signal.status === 'active';
    if (filter === 'buy') return signal.type === 'buy';
    if (filter === 'sell') return signal.type === 'sell';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'hit_tp':
        return 'success';
      case 'hit_sl':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!hasActiveSubscription) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Trading Signals Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time trading signals for your portfolio
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <ShowChart sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {signals.length}
                  </Typography>
                  <Typography variant="body2">Total Signals</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {signals.filter((s) => s.type === 'buy').length}
                  </Typography>
                  <Typography variant="body2">Buy Signals</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <TrendingDown sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {signals.filter((s) => s.type === 'sell').length}
                  </Typography>
                  <Typography variant="body2">Sell Signals</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Notifications sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {signals.filter((s) => s.status === 'active').length}
                  </Typography>
                  <Typography variant="body2">Active Signals</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Recent Signals
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Signals</MenuItem>
              <MenuItem value="active">Active Only</MenuItem>
              <MenuItem value="buy">Buy Signals</MenuItem>
              <MenuItem value="sell">Sell Signals</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Typography>Loading signals...</Typography>
        ) : filteredSignals.length === 0 ? (
          <Alert severity="info">No signals available at the moment.</Alert>
        ) : (
          <Grid container spacing={2}>
            {filteredSignals.map((signal) => (
              <Grid item xs={12} md={6} key={signal._id}>
                <Card
                  sx={{
                    border: '1px solid',
                    borderColor: signal.type === 'buy' ? 'success.main' : 'error.main',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {signal.tradingPair}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(signal.createdAt), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label={signal.type.toUpperCase()}
                          color={signal.type === 'buy' ? 'success' : 'error'}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <br />
                        <Chip
                          label={signal.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(signal.status)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Entry Price
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ${signal.entryPrice.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Take Profit
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          ${signal.takeProfit.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Stop Loss
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="error.main">
                          ${signal.stopLoss.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>

                    {signal.riskRewardRatio && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary">
                          Risk/Reward Ratio: {signal.riskRewardRatio.risk}:{signal.riskRewardRatio.reward}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;