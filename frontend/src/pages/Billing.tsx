import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  CreditCard,
  Cancel,
  Edit,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { format } from 'date-fns';

interface Subscription {
  _id: string;
  plan: string;
  status: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
}

const Billing: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState({
    currency: user?.paymentMethod?.currency || 'USD',
    lastFour: '',
    brand: 'Visa',
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions/my-subscriptions');
      setSubscriptions(response.data.subscriptions);
    } catch (err: any) {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;

    try {
      await api.delete(`/subscriptions/${selectedSubscription}`);
      setSuccess('Subscription cancelled successfully');
      setCancelDialogOpen(false);
      fetchSubscriptions();
      
      if (user) {
        updateUser({
          subscription: {
            ...user.subscription,
            status: 'cancelled',
            autoRenew: false,
          },
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel subscription');
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      await api.put('/subscriptions/payment-method', paymentData);
      setSuccess('Payment method updated successfully');
      setPaymentDialogOpen(false);
      
      if (user) {
        updateUser({
          paymentMethod: paymentData,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update payment method');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'cancelled':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Billing & Subscription
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Manage your subscription and payment methods
      </Typography>

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

      <Grid container spacing={3}>
        {/* Current Subscription */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Current Subscription
                </Typography>
              </Box>

              {user?.subscription ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Plan Type
                    </Typography>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {user.subscription.type}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={user.subscription.status.toUpperCase()}
                      color={getStatusColor(user.subscription.status)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>

                  {user.subscription.endDate && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Renewal Date
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(user.subscription.endDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Auto-Renewal
                    </Typography>
                    <Typography variant="body1">
                      {user.subscription.autoRenew ? 'Enabled' : 'Disabled'}
                    </Typography>
                  </Box>

                  {user.subscription.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      fullWidth
                      onClick={() => {
                        setSelectedSubscription(subscriptions[0]?._id);
                        setCancelDialogOpen(true);
                      }}
                      sx={{ mt: 2 }}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </>
              ) : (
                <Alert severity="info">No active subscription</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Method */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Payment Method
                </Typography>
              </Box>

              {user?.paymentMethod ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Card Brand
                    </Typography>
                    <Typography variant="body1">
                      {user.paymentMethod.brand}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Card Number
                    </Typography>
                    <Typography variant="body1">
                      •••• •••• •••• {user.paymentMethod.lastFour}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Currency
                    </Typography>
                    <Typography variant="body1">
                      {user.paymentMethod.currency}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    fullWidth
                    onClick={() => setPaymentDialogOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    Update Payment Method
                  </Button>
                </>
              ) : (
                <Alert severity="info">No payment method on file</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Subscription History
            </Typography>

            {loading ? (
              <Typography>Loading...</Typography>
            ) : subscriptions.length === 0 ? (
              <Alert severity="info">No subscription history</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Plan</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub._id}>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {sub.plan}
                        </TableCell>
                        <TableCell>
                          {sub.currency} {sub.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sub.status.toUpperCase()}
                            color={getStatusColor(sub.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {format(new Date(sub.startDate), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(sub.endDate), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your subscription? You will lose access to
            trading signals at the end of your current billing period.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep Subscription</Button>
          <Button onClick={handleCancelSubscription} color="error" variant="contained">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Payment Method Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Update Payment Method</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={paymentData.currency}
                label="Currency"
                onChange={(e) =>
                  setPaymentData({ ...paymentData, currency: e.target.value })
                }
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Last 4 Digits"
              value={paymentData.lastFour}
              onChange={(e) =>
                setPaymentData({ ...paymentData, lastFour: e.target.value })
              }
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 4 }}
            />

            <FormControl fullWidth>
              <InputLabel>Card Brand</InputLabel>
              <Select
                value={paymentData.brand}
                label="Card Brand"
                onChange={(e) =>
                  setPaymentData({ ...paymentData, brand: e.target.value })
                }
              >
                <MenuItem value="Visa">Visa</MenuItem>
                <MenuItem value="Mastercard">Mastercard</MenuItem>
                <MenuItem value="Amex">American Express</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdatePaymentMethod} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Billing;