import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Box, Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import api from '../api';

export default function VisitDialog({
  open, onClose, patientId, onVisitSaved, visitData,
}) {
  const [date, setDate] = useState(dayjs());
  const [formData, setFormData] = useState({
    presentingComplaint: '',
    previousHistory: '',
    vitals: {
      hr: '', bp: '', rr: '', temp: '', bsr: '',
    },
    physicalExamination: {
      general: '', cvs: '', resp: '', abd: '', neuro: '',
    },
    prescription: Array(8).fill({ medicine: '', dose: '', frequency: '' }),
  });

  useEffect(() => {
    if (visitData) {
      setFormData({
        presentingComplaint: visitData.presentingComplaint || '',
        previousHistory: visitData.previousHistory || '',
        vitals: visitData.vitals || {
          hr: '', bp: '', rr: '', temp: '', bsr: '',
        },
        physicalExamination: visitData.physicalExamination || {
          general: '', cvs: '', resp: '', abd: '', neuro: '',
        },
        prescription: visitData.prescription.length ? visitData.prescription : Array(8).fill({ medicine: '', dose: '', frequency: '' }),
      });
      setDate(dayjs(visitData.date));
    }
  }, [visitData]);

  const handleChange = (e, section, index, field) => {
    if (section === 'prescription') {
      const newPrescription = [...formData.prescription];
      newPrescription[index] = { ...newPrescription[index], [field]: e.target.value };
      setFormData({ ...formData, prescription: newPrescription });
    } else if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [e.target.name]: e.target.value },
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    const visitPayload = {
      ...formData,
      date: date.toISOString(),
      patient: patientId,
    };

    try {
      if (visitData) {
        // Update existing visit
        await api.put(`/api/visits/${visitData._id}`, visitPayload);
      } else {
        // Create new visit
        await api.post('/api/visits', visitPayload);
      }
      onVisitSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save visit:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{visitData ? 'Edit Visit' : 'Add New Visit'}</DialogTitle>
      <DialogContent>
        {/* Date and Presenting Complaint */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <DatePicker label="Visit Date" value={date} onChange={(newDate) => setDate(newDate)} />
          <TextField
            label="Presenting Complaint"
            name="presentingComplaint"
            value={formData.presentingComplaint}
            onChange={handleChange}
            fullWidth
            sx={{ ml: 2 }}
          />
        </Box>

        {/* Previous History */}
        <TextField
          label="Previous Medical/Surgical History"
          name="previousHistory"
          value={formData.previousHistory}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />

        {/* Vitals */}
        <Typography variant="h6" gutterBottom>Vitals</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Object.keys(formData.vitals).map((key) => (
            <Grid item xs={12} sm={2.4} key={key}>
              <TextField
                label={key.toUpperCase()}
                name={key}
                value={formData.vitals[key]}
                onChange={(e) => handleChange(e, 'vitals')}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>

        {/* Physical Examination */}
        <Typography variant="h6" gutterBottom>Physical Examination</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Object.keys(formData.physicalExamination).map((key) => (
            <Grid item xs={12} sm={2.4} key={key}>
              <TextField
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={formData.physicalExamination[key]}
                onChange={(e) => handleChange(e, 'physicalExamination')}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>

        {/* Prescription */}
        <Typography variant="h6" gutterBottom>Rx</Typography>
        <Grid container spacing={1}>
          <Grid item xs={4}><Typography>Medicine</Typography></Grid>
          <Grid item xs={4}><Typography>Dose</Typography></Grid>
          <Grid item xs={4}><Typography>Frequency</Typography></Grid>
          {formData.prescription.map((row, index) => (
            <React.Fragment key={index}>
              <Grid item xs={4}>
                <TextField
                  value={row.medicine}
                  onChange={(e) => handleChange(e, 'prescription', index, 'medicine')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={row.dose}
                  onChange={(e) => handleChange(e, 'prescription', index, 'dose')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={row.frequency}
                  onChange={(e) => handleChange(e, 'prescription', index, 'frequency')}
                  fullWidth
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Visit</Button>
      </DialogActions>
    </Dialog>
  );
} 