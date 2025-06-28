import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Button, CircularProgress, Accordion, AccordionSummary,
  AccordionDetails, List, ListItem, ListItemText, Fab, AppBar, Toolbar, Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import VisitDialog from './VisitDialog';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const tokenConfig = () => {
  const token = localStorage.getItem('token');
  const config = { headers: { 'Content-type': 'application/json' } };
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
};

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/patients/details/${id}`, tokenConfig());
        setPatient(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPatientDetails();
  }, [id]);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveVisit = async (visitData) => {
    try {
      const res = await axios.post(`/api/visits/${id}`, visitData, tokenConfig());
      setPatient(prev => ({ ...prev, visits: [res.data, ...prev.visits] }));
    } catch (err) {
      console.error('Failed to save visit', err);
    }
    handleCloseDialog();
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (!patient) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Patient not found.</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {patient.name}
            </Typography>
            <Button color="inherit" onClick={() => navigate(-1)}>Back</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{p: 2, mb: 3}}>
            <Typography variant="h5" gutterBottom>Patient Details</Typography>
            <Typography variant="body1"><strong>Case Summary:</strong> {patient.caseSummary}</Typography>
            <Typography variant="body1"><strong>Date Added:</strong> {dayjs(patient.dateAdded).format('DD MMM YYYY')}</Typography>
          </Paper>

          <Typography variant="h5" gutterBottom>Visit History</Typography>
          {patient.visits && patient.visits.length > 0 ? patient.visits.map((visit) => (
            <Accordion key={visit._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Visit on {dayjs(visit.date).format('DD MMM YYYY, hh:mm A')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem><ListItemText primary="Vitals" secondary={`BP: ${visit.vitals.bp}, Temp: ${visit.vitals.temp}, Pulse: ${visit.vitals.pulse}, SpO2: ${visit.vitals.spo2}` } /></ListItem>
                  <ListItem><ListItemText primary="Physical Examination" secondary={visit.examination.general} /></ListItem>
                  <ListItem><ListItemText primary="Prescription" secondary={visit.prescription.join(', ')} /></ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          )) : <Typography>No visit history found.</Typography>}
        </Container>

        <VisitDialog open={dialogOpen} onClose={handleCloseDialog} onSave={handleSaveVisit} />

        <Fab color="primary" aria-label="add-visit" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={handleOpenDialog}>
          <AddIcon />
        </Fab>
      </Box>
    </LocalizationProvider>
  );
}

export default PatientDetail;