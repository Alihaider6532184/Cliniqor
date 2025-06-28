import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Grid, Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const initialState = {
  date: dayjs(),
  vitals: {
    bp: '',
    pulse: '',
    temp: '',
    spo2: ''
  },
  examination: {
    general: '',
    chest: '',
    cvs: '',
    cns: ''
  },
  investigations: [''],
  prescription: [''],
};

export default function VisitDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState(initialState);

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleChange = (e, category) => {
    const { name, value } = e.target;
    if (category) {
      setFormData({
        ...formData,
        [category]: {
          ...formData[category],
          [name]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      date: formData.date.toISOString(),
      investigations: formData.investigations.filter(inv => inv),
      prescription: formData.prescription.filter(pre => pre),
    };
    onSave(dataToSave);
    setFormData(initialState); // Reset form after saving
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Visit</DialogTitle>
      <DialogContent>
        <DateTimePicker
          label="Visit Date & Time"
          value={formData.date}
          onChange={handleDateChange}
          slots={{ textField: (params) => <TextField {...params} fullWidth margin="normal" /> }}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>Vitals</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}><TextField label="BP (e.g., 120/80)" name="bp" value={formData.vitals.bp} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6} sm={3}><TextField label="Pulse (bpm)" name="pulse" value={formData.vitals.pulse} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6} sm={3}><TextField label="Temp (°F)" name="temp" value={formData.vitals.temp} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6} sm={3}><TextField label="SpO2 (%)" name="spo2" value={formData.vitals.spo2} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 2 }}>Physical Examination</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField label="General" name="general" value={formData.examination.general} onChange={(e) => handleChange(e, 'examination')} fullWidth margin="dense" multiline rows={2} /></Grid>
          <Grid item xs={6}><TextField label="Chest" name="chest" value={formData.examination.chest} onChange={(e) => handleChange(e, 'examination')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6}><TextField label="CVS (Cardiovascular)" name="cvs" value={formData.examination.cvs} onChange={(e) => handleChange(e, 'examination')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6}><TextField label="CNS (Central Nervous)" name="cns" value={formData.examination.cns} onChange={(e) => handleChange(e, 'examination')} fullWidth margin="dense" /></Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 2 }}>Investigations</Typography>
        {formData.investigations.map((inv, index) => (
          <TextField key={index} label={`Investigation ${index + 1}`} value={inv} onChange={(e) => handleArrayChange(e, index, 'investigations')} fullWidth margin="dense" />
        ))}
        <Button onClick={() => addArrayField('investigations')} sx={{ mt: 1 }}>Add Investigation</Button>
        
        <Typography variant="h6" sx={{ mt: 2 }}>Prescription</Typography>
        {formData.prescription.map((pre, index) => (
          <TextField key={index} label={`Medication ${index + 1}`} value={pre} onChange={(e) => handleArrayChange(e, index, 'prescription')} fullWidth margin="dense" />
        ))}
        <Button onClick={() => addArrayField('prescription')} sx={{ mt: 1 }}>Add Medication</Button>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}