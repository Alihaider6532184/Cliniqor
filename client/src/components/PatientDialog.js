import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function PatientDialog({ open, onClose, onSave, patient }) {
  const [formData, setFormData] = useState({
    name: '',
    caseSummary: '',
    dateAdded: dayjs(),
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        caseSummary: patient.caseSummary,
        dateAdded: dayjs(patient.dateAdded),
      });
    } else {
      setFormData({
        name: '',
        caseSummary: '',
        dateAdded: dayjs(),
      });
    }
  }, [patient, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, dateAdded: newDate });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{patient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Patient Name"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="caseSummary"
          label="Case Summary (2-3 words)"
          type="text"
          fullWidth
          variant="standard"
          value={formData.caseSummary}
          onChange={handleChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={formData.dateAdded}
            onChange={handleDateChange}
            slots={{ textField: (params) => <TextField {...params} margin="dense" fullWidth variant="standard" /> }}
            enableAccessibleFieldDOMStructure={false}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
} 