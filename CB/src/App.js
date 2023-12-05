import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TextField, Button, Container, CssBaseline, Paper, Grid } from '@mui/material';
import MapComponent from './Pages/MapComponent';
import EvStation from './Pages/EvStation';
import { Helmet } from 'react-helmet';

const WelcomeMessage = ({ userType }) => (
  <div style={{ color: '#000', backgroundColor: '#fff', textAlign: 'center', padding: 5,position:'sticky',zIndex:'9999',width:'100%' }}>
    Welcome, {userType === 'user' ? 'EV User' : 'EV Station'}!
     </div>
);

const FlashCard = ({ userType }) => (
  <div style={{ color: 'blue', background: 'white', display: 'flex', justifyContent: 'center' }}>
    <WelcomeMessage userType={userType} />
  </div>
);

// const EVStationComponent = () => (
//   <div style={{ color: 'white', backgroundColor: '#001B79', textAlign: 'center', padding: '50px', height:'150vh' }}>
//     <EvStation/>
//   </div>
// );

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Add your login logic here
    // You may want to redirect to the home page if login is successful
    console.log('Logging in as:', userType, phoneNumber);
    setLoggedIn(true); // For demonstration, setLoggedIn(true) on login success
  };

  useEffect(() => {
    let timeoutId;

    if (isLoggedIn) {
      // After successful login, setLoggedIn(false) after 2 seconds
      timeoutId = setTimeout(() => {
        setLoggedIn(true); // Reset isLoggedIn state
      }, 3000);
    }

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, [isLoggedIn]);

  return (
    <Router>

        <Helmet>
        <meta property="og:title" content="EV BUDDY" />
        <meta property="og:description" content="EV Buddy is a cutting-edge mobile application designed to enhance the electric vehicle (EV) experience for both users and charging station operators. Our app seamlessly connects EV enthusiasts with nearby charging stations, providing real-time information on station availability, charging levels, and queue status. Whether you're an electric vehicle user looking for the nearest charging point or an EV station operator managing your facility, EV Buddy streamlines the entire process." />
        <meta property="og:image" content="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/24/external-power-location-on-map-for-quick-ev-charge-battery-shadow-tal-revivo.png" />
        {/* Add more OG tags as needed */}
      </Helmet>
      <CssBaseline />
      {isLoggedIn ? (
        <>
          <FlashCard userType={userType} />
          {userType === 'user' ? <Navigate to={`/home/${phoneNumber}`} /> : <Navigate to="/evstation" />}
        </>
      ) : (
        <Container  sx={{background:'#001B79',height:'100vh',display: 'flex', flexDirection: 'column', textAlign: 'center' ,justifyContent:'center'}}>

          <center>
          <Paper elevation={3} style={{ padding: '30px',boxShadow:"7px 7px 9px rgba(0,0,0,0.5)" }}>
          <h4 style={{fontWeight:'700',color:'#001B79',marginBottom:"20px"}}>EV BUDDY</h4>

            <Grid container spacing={2} style={{  }}>
              
              <Grid item xs={6}>
                <Button fullWidth variant={userType === 'user' ? 'contained' : 'outlined'} onClick={() => setUserType('user')}>
                  EV User
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant={userType === 'station' ? 'contained' : 'outlined'} onClick={() => setUserType('station')}>
                  EV Station
                </Button>
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="tel"
              autoFocus
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button fullWidth variant="contained" color="primary" onClick={handleLogin} style={{ marginTop: 3 }}>
              Login
            </Button>
          </Paper>
          </center>
        </Container>
      )}

      <Routes>
        <Route path="/home/:phoneNumber" element={<MapComponent />} />
        <Route path="/evstation" element={<EvStation />} />
      </Routes>
    </Router>
  );
};

export default Login;
