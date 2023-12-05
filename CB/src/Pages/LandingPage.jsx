import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const LandingPage = () => {
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to the EV Charging Locator
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Electric Bus Driver
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register or log in to access the Charging Station Locator and more.
              </Typography>
              <Link to="/driver/login">Login</Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Charging Station Operator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register or log in to access the Operator Portal and update live data.
              </Typography>
              <Link to="/operator/login">Login</Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPage;
