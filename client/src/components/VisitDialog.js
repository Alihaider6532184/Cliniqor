import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Grid, Typography, IconButton, Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import dayjs from 'dayjs';

const initialPrescriptionRow = { medicine: '', dose: '', frequency: '' };
const initialState = {
  date: dayjs(),
  presentingComplaint: '',
  previousHistory: '',
  vitals: { hr: '', bp: '', rr: '', temp: '', bsr: '' },
  physicalExamination: { general: '', cvs: '', resp: '', abd: '', neuro: '' },
  prescription: Array(5).fill(null).map(() => ({ ...initialPrescriptionRow })),
};

export default function VisitDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState(initialState);

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePrescriptionChange = (e, index) => {
    const { name, value } = e.target;
    const newPrescription = [...formData.prescription];
    newPrescription[index] = { ...newPrescription[index], [name]: value };
    setFormData({ ...formData, prescription: newPrescription });
  };

  const addPrescriptionRow = () => {
    setFormData({ ...formData, prescription: [...formData.prescription, { ...initialPrescriptionRow }] });
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      date: formData.date.toISOString(),
      // Filter out empty prescription rows before saving
      prescription: formData.prescription.filter(p => p.medicine.trim() !== ''),
    };
    onSave(dataToSave);
    setFormData(initialState); // Reset form
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Add New Visit</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Visit Date & Time"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="P/C (Presenting Complaint)" name="presentingComplaint" value={formData.presentingComplaint} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
        </Grid>
        <TextField label="Previous Medical/Surgical History" name="previousHistory" value={formData.previousHistory} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
        
        <Typography variant="h6" sx={{ mt: 2 }}>Vitals</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={2.4}><TextField label="H.R" name="hr" value={formData.vitals.hr} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6} sm={2.4}><TextField label="B.P" name="bp" value={formData.vitals.bp} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6} sm={2.4}><TextField label="R.R" name="rr" value={formData.vitals.rr} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6} sm={2.4}><TextField label="Temp" name="temp" value={formData.vitals.temp} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
          <Grid item xs={6} sm={2.4}><TextField label="BSR" name="bsr" value={formData.vitals.bsr} onChange={(e) => handleChange(e, 'vitals')} fullWidth margin="dense" /></Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 2 }}>Physical Examination</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField label="General" name="general" value={formData.physicalExamination.general} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth margin="dense" /></Grid>
          <Grid item xs={12} sm={6}><TextField label="CVS" name="cvs" value={formData.physicalExamination.cvs} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth margin="dense" /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Resp" name="resp" value={formData.physicalExamination.resp} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth margin="dense" /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Abd" name="abd" value={formData.physicalExamination.abd} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth margin="dense" /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Neuro" name="neuro" value={formData.physicalExamination.neuro} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth margin="dense" /></Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 2 }}>Rx (Prescription)</Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={5}><Typography variant="subtitle2">Medicine</Typography></Grid>
          <Grid item xs={3}><Typography variant="subtitle2">Dose</Typography></Grid>
          <Grid item xs={4}><Typography variant="subtitle2">Frequency</Typography></Grid>
          {formData.prescription.map((p, index) => (
            <React.Fragment key={index}>
              <Grid item xs={5}><TextField name="medicine" value={p.medicine} onChange={(e) => handlePrescriptionChange(e, index)} fullWidth margin="dense" variant="outlined" size="small" /></Grid>
              <Grid item xs={3}><TextField name="dose" value={p.dose} onChange={(e) => handlePrescriptionChange(e, index)} fullWidth margin="dense" variant="outlined" size="small" /></Grid>
              <Grid item xs={4}><TextField name="frequency" value={p.frequency} onChange={(e) => handlePrescriptionChange(e, index)} fullWidth margin="dense" variant="outlined" size="small" /></Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Button startIcon={<AddCircleOutlineIcon />} onClick={addPrescriptionRow} sx={{ mt: 1 }}>Add Row</Button>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Visit</Button>
      </DialogActions>
    </Dialog>
  );
}