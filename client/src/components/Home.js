import React from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, AppBar, Toolbar, Button } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6 }
            }}>
              <CardActionArea component={RouterLink} to="/patients/opd">
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <GroupIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                  <Typography gutterBottom variant="h5" component="div" sx={{ mt: 2 }}>
                    OPD Patients
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage Out-Patient Department records
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6 }
            }}>
              <CardActionArea component={RouterLink} to="/patients/ward">
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <LocalHospitalIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
                  <Typography gutterBottom variant="h5" component="div" sx={{ mt: 2 }}>
                    Ward/Hospital Patients
                  </Typography>
                   <Typography variant="body2" color="text.secondary">
                    Manage admitted patient records
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Home; 