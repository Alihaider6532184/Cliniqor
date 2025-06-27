import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import AuthCallback from './components/AuthCallback';
import { Container, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Link as RouterLink } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* If not logged in, all roads lead to login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* All protected routes are children of PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />}>
            {/* The dashboard's index page */}
            <Route index element={
              <Container sx={{ mt: 4 }}>
                <Grid container spacing={4} justifyContent="center">
                  <Grid xs={12} sm={6} md={4}>
                    <Card sx={{
                      transition: '0.3s',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}>
                      <CardActionArea component={RouterLink} to="/patients/opd">
                        <CardContent sx={{ textAlign: 'center', p: 4 }}>
                          <GroupIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                          <Typography gutterBottom variant="h5" component="div" sx={{ mt: 2 }}>
                            OPD Patients
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid xs={12} sm={6} md={4}>
                    <Card sx={{
                      transition: '0.3s',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}>
                      <CardActionArea component={RouterLink} to="/patients/ward">
                        <CardContent sx={{ textAlign: 'center', p: 4 }}>
                          <LocalHospitalIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
                          <Typography gutterBottom variant="h5" component="div" sx={{ mt: 2 }}>
                            Ward/Hospital Patients
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Container>
            } />
            <Route path="patients/:category" element={<PatientList />} />
            <Route path="patient/:id" element={<PatientDetail />} />
          </Route>
        </Route>

        {/* Redirect any other path to the root */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
