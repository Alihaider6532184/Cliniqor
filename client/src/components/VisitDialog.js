import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

export default function VisitDialog({ open, onClose, onSave, visit }) {
  const initialPrescriptionRow = { medicine: '', dose: '', frequency: '' };
  const [formData, setFormData] = useState({
    date: dayjs(),
    presentingComplaint: '',
    previousHistory: '',
    vitals: { hr: '', bp: '', rr: '', temp: '', bsr: '' },
    physicalExamination: { general: '', cvs: '', resp: '', abd: '', neuro: '' },
    prescription: Array(8).fill(null).map(() => ({ ...initialPrescriptionRow })),
  });

  useEffect(() => {
    if (visit) {
      // Logic for editing an existing visit
      setFormData({
        date: dayjs(visit.date),
        presentingComplaint: visit.presentingComplaint || '',
        previousHistory: visit.previousHistory || '',
        vitals: visit.vitals || { hr: '', bp: '', rr: '', temp: '', bsr: '' },
        physicalExamination: visit.physicalExamination || { general: '', cvs: '', resp: '', abd: '', neuro: '' },
        prescription: visit.prescription.length ? visit.prescription : Array(8).fill(null).map(() => ({ ...initialPrescriptionRow })),
      });
    } else {
      // Logic for adding a new visit
      setFormData({
        date: dayjs(),
        presentingComplaint: '',
        previousHistory: '',
        vitals: { hr: '', bp: '', rr: '', temp: '', bsr: '' },
        physicalExamination: { general: '', cvs: '', resp: '', abd: '', neuro: '' },
        prescription: Array(8).fill(null).map(() => ({ ...initialPrescriptionRow })),
      });
    }
  }, [visit, open]);

  const handleChange = (e, section) => {
    if (section === 'vitals' || section === 'physicalExamination') {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [e.target.name]: e.target.value
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handlePrescriptionChange = (e, index) => {
    const updatedPrescription = [...formData.prescription];
    updatedPrescription[index][e.target.name] = e.target.value;
    setFormData({ ...formData, prescription: updatedPrescription });
  };
  
  const addPrescriptionRow = () => {
    setFormData({
      ...formData,
      prescription: [...formData.prescription, { ...initialPrescriptionRow }]
    });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{visit ? 'Edit Visit' : 'Add New Visit'}</DialogTitle>
      <DialogContent>
        {/* Main Info */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Visit Date"
                value={formData.date}
                onChange={handleDateChange}
                enableAccessibleFieldDOMStructure={false}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField label="P/C (Presenting Complaint)" name="presentingComplaint" value={formData.presentingComplaint} onChange={handleChange} fullWidth multiline rows={2}/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Previous History" name="previousHistory" value={formData.previousHistory} onChange={handleChange} fullWidth multiline rows={2}/>
          </Grid>
        </Grid>

        {/* Vitals Section */}
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
            Vitals
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}><TextField label="H.R" name="hr" value={formData.vitals.hr} onChange={(e) => handleChange(e, 'vitals')} fullWidth /></Grid>
            <Grid item xs={6} md={2}><TextField label="B.P" name="bp" value={formData.vitals.bp} onChange={(e) => handleChange(e, 'vitals')} fullWidth /></Grid>
            <Grid item xs={6} md={2}><TextField label="R.R" name="rr" value={formData.vitals.rr} onChange={(e) => handleChange(e, 'vitals')} fullWidth /></Grid>
            <Grid item xs={6} md={2}><TextField label="Temp" name="temp" value={formData.vitals.temp} onChange={(e) => handleChange(e, 'vitals')} fullWidth /></Grid>
            <Grid item xs={12} md={4}><TextField label="BSR" name="bsr" value={formData.vitals.bsr} onChange={(e) => handleChange(e, 'vitals')} fullWidth /></Grid>
          </Grid>
        </Paper>

        {/* Physical Examination Section */}
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
            Physical Examination
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><TextField label="General Physical" name="general" value={formData.physicalExamination.general} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth /></Grid>
            <Grid item xs={12} md={4}><TextField label="CVS" name="cvs" value={formData.physicalExamination.cvs} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth /></Grid>
            <Grid item xs={12} md={4}><TextField label="Resp." name="resp" value={formData.physicalExamination.resp} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth /></Grid>
            <Grid item xs={12} md={6}><TextField label="Abd." name="abd" value={formData.physicalExamination.abd} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth /></Grid>
            <Grid item xs={12} md={6}><TextField label="Neuro" name="neuro" value={formData.physicalExamination.neuro} onChange={(e) => handleChange(e, 'physicalExamination')} fullWidth /></Grid>
          </Grid>
        </Paper>

        {/* Prescription Section */}
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
            Rx (Prescription)
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Medicine</TableCell>
                  <TableCell>Dose</TableCell>
                  <TableCell>Frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.prescription.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell><TextField name="medicine" value={row.medicine} onChange={(e) => handlePrescriptionChange(e, index)} fullWidth variant="standard" /></TableCell>
                    <TableCell><TextField name="dose" value={row.dose} onChange={(e) => handlePrescriptionChange(e, index)} fullWidth variant="standard" /></TableCell>
                    <TableCell><TextField name="frequency" value={row.frequency} onChange={(e) => handlePrescriptionChange(e, index)} fullWidth variant="standard" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button startIcon={<AddIcon />} onClick={addPrescriptionRow} sx={{ mt: 1 }}>
            Add Row
          </Button>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Visit</Button>
      </DialogActions>
    </Dialog>
  );
} 