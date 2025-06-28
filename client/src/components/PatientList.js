import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, List, ListItem, ListItemText,
  IconButton, Fab, CircularProgress, Divider, ListItemButton, TextField, Button, AppBar, Toolbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PatientDialog from './PatientDialog';
import dayjs from 'dayjs';

// Function to create an auth token header
const tokenConfig = () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
};

export default function PatientList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/patients/${category}`, tokenConfig());
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPatients();
  }, [category]);

  const filteredPatients = patients.filter(patient =>
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (patient = null) => {
    setCurrentPatient(patient);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentPatient(null);
  };

  const handleSavePatient = async (formData) => {
    const body = {
      name: formData.name,
      caseSummary: formData.caseSummary,
      dateAdded: formData.dateAdded.toISOString(),
      category: category,
    };

    try {
      if (currentPatient) {
        // Update existing patient
        const res = await axios.put(`/api/patients/${currentPatient._id}`, body, tokenConfig());
        setPatients(patients.map(p => p._id === currentPatient._id ? res.data : p));
      } else {
        // Add new patient
        const res = await axios.post('/api/patients', body, tokenConfig());
        setPatients([res.data, ...patients]);
      }
    } catch (err) {
      console.error(err);
    }
    handleCloseDialog();
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`/api/patients/${id}`, tokenConfig());
        setPatients(patients.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {category && category.charAt(0).toUpperCase() + category.slice(1)} Patients
          </Typography>
          <Button color="inherit" onClick={() => navigate('/home')}>Back</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 4 }}>
          <TextField
            fullWidth
            label="Search by Patient Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
        <List>
          {filteredPatients.map((patient, index) => (
            <React.Fragment key={patient._id}>
              <ListItem
                disablePadding
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(patient)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePatient(patient._id)} sx={{ ml: 1 }}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemButton component={RouterLink} to={`/patient/${patient._id}`}>
                  <ListItemText
                    primary={`${index + 1}. ${patient.name}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {patient.caseSummary}
                        </Typography>
                        {` — Added on: ${dayjs(patient.dateAdded).format('DD MMM YYYY')}`}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Container>
      <PatientDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSavePatient}
        patient={currentPatient}
      />
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
} 