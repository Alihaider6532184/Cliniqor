import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PatientList from './PatientList';
import PatientDialog from './PatientDialog';

function Home() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRefresh(!refresh); // Toggle refresh state to trigger PatientList update
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <PatientList key={refresh} />
        <PatientDialog open={open} handleClose={handleClose} />
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
          }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}

export default Home; 