import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';

export default function Home() {
  const navigate = useNavigate();

  const [anchorElPatients, setAnchorElPatients] = useState(null);
  const [anchorElAccount, setAnchorElAccount] = useState(null);

  const handlePatientsMenuOpen = (event) => {
    setAnchorElPatients(event.currentTarget);
  };

  const handlePatientsMenuClose = () => {
    setAnchorElPatients(null);
  };

  const handleAccountMenuOpen = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorElAccount(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleAccountMenuClose();
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ mr: 2, color: 'inherit', textDecoration: 'none' }}>
            Doctor Dashboard
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />

          <Button 
            color="inherit" 
            onClick={handleAccountMenuOpen}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              border: '1px solid transparent',
              padding: '6px 16px'
            }}
          >
            My Account
          </Button>
          <Menu
            anchorEl={anchorElAccount}
            open={Boolean(anchorElAccount)}
            onClose={handleAccountMenuClose}
          >
            <MenuItem onClick={handleAccountMenuClose}>Switch Account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>
    </div>
  );
} 