import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  People,
  ShowChart,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';
import api from '../../config/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalSignals: 0,
    activeSignals: 0,
    winRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userStats, signalStats] = await Promise.all([
        api.get('/users/stats'),
        api.get('/signals/stats'),
      ]);

      setStats({
        totalUsers: userStats.data.stats.totalUsers,
        activeSubscribers: userStats.data.stats.activeSubscribers,
        totalSignals: signalStats.data.stats.totalSignals,
        activeSignals: signalStats.data.stats.activeSignals,
        winRate: signalStats.data.stats.winRate,
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Overview of platform statistics
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <People sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2">Total Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.activeSubscribers}
                  </Typography>
                  <Typography variant="body2">Active Subscribers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <ShowChart sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalSignals}
                  </Typography>
                  <Typography variant="body2">Total Signals</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.winRate}%
                  </Typography>
                  <Typography variant="body2">Win Rate</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • Create new trading signals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Manage user subscriptions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • View signal performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Monitor user activity
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Platform Status
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Active Signals: {stats.activeSignals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subscription Rate: {stats.totalUsers > 0 ? ((stats.activeSubscribers / stats.totalUsers) * 100).toFixed(1) : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Signal Win Rate: {stats.winRate}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;