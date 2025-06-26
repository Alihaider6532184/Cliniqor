import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, CircularProgress, Button, Accordion,
  AccordionSummary, AccordionDetails, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import VisitDialog from './VisitDialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Function to create an auth token header from PatientList.js (can be moved to a utils file)
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

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPatientAndVisits = async () => {
      setLoading(true);
      try {
        const patientRes = await axios.get(`/api/patients/details/${id}`, tokenConfig());
        setPatient(patientRes.data);

        const visitsRes = await axios.get(`/api/visits/${id}`, tokenConfig());
        setVisits(visitsRes.data);

      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPatientAndVisits();
  }, [id]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveVisit = async (formData) => {
    try {
      const res = await axios.post(`/api/visits/${id}`, formData, tokenConfig());
      setVisits([res.data, ...visits]);
    } catch (err) {
      console.error(err.response.data);
    }
    handleCloseDialog();
  };

  const generatePdf = (visit) => {
    const doc = new jsPDF();
    const visitDate = dayjs(visit.date).format('DD MMMM YYYY');
    const fileName = `Visit_Report_${patient.name}_${dayjs(visit.date).format('YYYY-MM-DD')}.pdf`;

    // Add header
    doc.setFontSize(20);
    doc.text('Visit Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Patient: ${patient.name}`, 14, 32);
    doc.text(`Date: ${visitDate}`, 150, 32, { align: 'right' });
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    let yPos = 48; // Initial Y position after header

    // Add main complaints
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Chief Complaints & History', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`P/C: ${visit.presentingComplaint || 'N/A'}`, 16, yPos);
    yPos += 7;
    doc.text(`Previous History: ${visit.previousHistory || 'N/A'}`, 16, yPos);
    yPos += 12;

    // Add Vitals
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Vitals', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const vitalsText = `H.R: ${visit.vitals?.hr || '-'}  |  B.P: ${visit.vitals?.bp || '-'}  |  R.R: ${visit.vitals?.rr || '-'}  |  Temp: ${visit.vitals?.temp || '-'}  |  BSR: ${visit.vitals?.bsr || '-'}`;
    doc.text(vitalsText, 16, yPos);
    yPos += 12;

    // Add Physical Examination
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Physical Examination', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const examFields = [
      { label: 'General', value: visit.physicalExamination?.general },
      { label: 'CVS', value: visit.physicalExamination?.cvs },
      { label: 'Resp', value: visit.physicalExamination?.resp },
      { label: 'Abd', value: visit.physicalExamination?.abd },
      { label: 'Neuro', value: visit.physicalExamination?.neuro },
    ];
    examFields.forEach(field => {
      if (field.value) {
        doc.text(`${field.label}: ${field.value}`, 16, yPos);
        yPos += 7;
      }
    });
    yPos = Math.max(yPos, yPos); // Ensure yPos is updated
    yPos += 5; // Add some padding

    // Add Prescription Table
    const tableData = visit.prescription?.filter(p => p.medicine).map(p => [p.medicine, p.dose, p.frequency]);
    if (tableData && tableData.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Medicine', 'Dose', 'Frequency']],
        body: tableData,
        headStyles: { fillColor: [22, 160, 133] }, // A professional green color
        theme: 'grid',
      });
    }

    doc.save(fileName);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Visit History for {patient ? patient.name : 'Patient'}
        </Typography>
      </Box>
      
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpenDialog}>
        Add New Visit
      </Button>

      <VisitDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveVisit}
      />

      {visits.map((visit, index) => (
        <Accordion key={visit._id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              {`Visit #${visits.length - index}`}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Date: {dayjs(visit.date).format('DD MMM YYYY')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {/* Main Complaints */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography><strong>P/C:</strong> {visit.presentingComplaint}</Typography>
                <Typography sx={{ mt: 1 }}><strong>Previous History:</strong> {visit.previousHistory}</Typography>
              </Paper>

              {/* Vitals Section */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                  Vitals
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={2}><Typography><strong>H.R:</strong> {visit.vitals?.hr}</Typography></Grid>
                  <Grid item xs={6} md={2}><Typography><strong>B.P:</strong> {visit.vitals?.bp}</Typography></Grid>
                  <Grid item xs={6} md={2}><Typography><strong>R.R:</strong> {visit.vitals?.rr}</Typography></Grid>
                  <Grid item xs={6} md={2}><Typography><strong>Temp:</strong> {visit.vitals?.temp}</Typography></Grid>
                  <Grid item xs={12} md={4}><Typography><strong>BSR:</strong> {visit.vitals?.bsr}</Typography></Grid>
                </Grid>
              </Paper>
              
              {/* Physical Examination Section */}
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                  Physical Examination
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}><Typography><strong>General:</strong> {visit.physicalExamination?.general}</Typography></Grid>
                  <Grid item xs={12} md={4}><Typography><strong>CVS:</strong> {visit.physicalExamination?.cvs}</Typography></Grid>
                  <Grid item xs={12} md={4}><Typography><strong>Resp:</strong> {visit.physicalExamination?.resp}</Typography></Grid>
                  <Grid item xs={12} md={6}><Typography><strong>Abd:</strong> {visit.physicalExamination?.abd}</Typography></Grid>
                  <Grid item xs={12} md={6}><Typography><strong>Neuro:</strong> {visit.physicalExamination?.neuro}</Typography></Grid>
                </Grid>
              </Paper>
              
              {/* Prescription Section */}
              <Paper variant="outlined" sx={{ p: 2 }}>
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
                      {visit.prescription?.filter(p => p.medicine).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.medicine}</TableCell>
                          <TableCell>{row.dose}</TableCell>
                          <TableCell>{row.frequency}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => generatePdf(visit)}>
                  Download Report
                </Button>
              </Paper>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
} 