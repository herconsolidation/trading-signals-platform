import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { Check, Star } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

interface Plan {
  name: string;
  duration: string;
  prices: {
    USD: number;
    EUR: number;
    GBP: number;
  };
  features: string[];
  savings?: string;
}

const Subscription: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<{ monthly: Plan; yearly: Plan } | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscriptions/plans');
      setPlans(response.data.plans);
    } catch (err: any) {
      setError('Failed to load subscription plans');
    }
  };

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/subscriptions', {
        plan: planType,
        currency,
        paymentMethod: {
          lastFour: '4242',
          brand: 'Visa',
        },
      });

      setSuccess('Subscription activated successfully!');
      
      // Update user context
      if (user) {
        updateUser({
          subscription: {
            type: planType,
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: response.data.subscription.endDate,
            autoRenew: true,
          },
        });
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plans) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading plans...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Get access to professional trading signals
        </Typography>

        <FormControl sx={{ mt: 3, minWidth: 200 }}>
          <InputLabel>Currency</InputLabel>
          <Select
            value={currency}
            label="Currency"
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value="USD">USD ($)</MenuItem>
            <MenuItem value="EUR">EUR (€)</MenuItem>
            <MenuItem value="GBP">GBP (£)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4} justifyContent="center">
        {/* Monthly Plan */}
        {/* FIX: Added component="div" to resolve TS2769 */}
        <Grid item xs={12} md={6} component="div">
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid',
              borderColor: 'primary.main',
              '&:hover': {
                boxShadow: 12,
                transform: 'translateY(-8px)',
                transition: 'all 0.3s',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {plans.monthly.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {plans.monthly.duration}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h3" fontWeight="bold" component="span">
                  {currency === 'USD' && '$'}
                  {currency === 'EUR' && '€'}
                  {currency === 'GBP' && '£'}
                  {plans.monthly.prices[currency as keyof typeof plans.monthly.prices]}
                </Typography>
                <Typography variant="h6" component="span" color="text.secondary">
                  /month
                </Typography>
              </Box>

              <List>
                {plans.monthly.features.map((feature, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon>
                      <Check color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleSubscribe('monthly')}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {loading ? 'Processing...' : 'Subscribe Monthly'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Yearly Plan */}
        {/* FIX: Added component="div" to resolve TS2769 */}
        <Grid item xs={12} md={6} component="div">
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '3px solid',
              borderColor: 'success.main',
              position: 'relative',
              '&:hover': {
                boxShadow: 12,
                transform: 'translateY(-8px)',
                transition: 'all 0.3s',
              },
            }}
          >
            <Chip
              label="BEST VALUE"
              color="success"
              icon={<Star />}
              sx={{
                position: 'absolute',
                top: -12,
                right: 20,
                fontWeight: 'bold',
              }}
            />
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {plans.yearly.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {plans.yearly.duration}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h3" fontWeight="bold" component="span">
                  {currency === 'USD' && '$'}
                  {currency === 'EUR' && '€'}
                  {currency === 'GBP' && '£'}
                  {plans.yearly.prices[currency as keyof typeof plans.yearly.prices]}
                </Typography>
                <Typography variant="h6" component="span" color="text.secondary">
                  /year
                </Typography>
                {plans.yearly.savings && (
                  <Chip
                    label={plans.yearly.savings}
                    color="success"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                )}
              </Box>

              <List>
                {plans.yearly.features.map((feature, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon>
                      <Check color="success" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleSubscribe('yearly')}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                }}
              >
                {loading ? 'Processing...' : 'Subscribe Yearly'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 6, p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          All plans include:
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time signal notifications • Multiple trading pairs • Entry, TP & SL prices •
          Risk/Reward calculations • Mobile access • Email support
        </Typography>
      </Paper>
    </Container>
  );
};

export default Subscription;