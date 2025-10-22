import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  // ADDED ListItemButton to fix the TS error
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  TrendingUp,
  Dashboard,
  Subscriptions,
  Payment,
  People,
  ShowChart,
  AdminPanelSettings,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Subscription', path: '/subscription', icon: <Subscriptions /> },
    { label: 'Billing', path: '/billing', icon: <Payment /> },
  ];

  const adminMenuItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: <AdminPanelSettings /> },
    { label: 'Signals', path: '/admin/signals', icon: <ShowChart /> },
    { label: 'Users', path: '/admin/users', icon: <People /> },
  ];

  const menuItems = isAdmin ? [...userMenuItems, ...adminMenuItems] : userMenuItems;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <TrendingUp sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/dashboard')}
            >
              Trading Signals
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={() => setDrawerOpen(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <TrendingUp sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                fontWeight: 700,
              }}
            >
              Trading Signals
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => navigate('/dashboard')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Dashboard
              </Button>
              {isAdmin && (
                <>
                  <Button
                    onClick={() => navigate('/admin')}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Admin
                  </Button>
                  <Button
                    onClick={() => navigate('/admin/signals')}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Signals
                  </Button>
                  <Button
                    onClick={() => navigate('/admin/users')}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Users
                  </Button>
                </>
              )}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Typography textAlign="center">{user?.email}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { navigate('/subscription'); handleCloseUserMenu(); }}>
                  <ListItemIcon>
                    <Subscriptions fontSize="small" />
                  </ListItemIcon>
                  Subscription
                </MenuItem>
                <MenuItem onClick={() => { navigate('/billing'); handleCloseUserMenu(); }}>
                  <ListItemIcon>
                    <Payment fontSize="small" />
                  </ListItemIcon>
                  Billing
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {menuItems.map((item) => (
              // FIX: Replaced ListItem with ListItemButton
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
            <Divider />
            {/* FIX: Replaced ListItem button with ListItemButton for Logout */}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'grey.100',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Trading Signals Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;