import React, { useState } from 'react';
import { TextField, Button, InputAdornment, Select, MenuItem, colors } from '@mui/material';
import { app, database } from '../firebase'; // Update the path to your firebase.js file

const EvStation = () => {
  const [distance, setDistance] = useState('');
  const [grid1, setGrid1] = useState('');
  const [grid2, setGrid2] = useState('');
  const [queue1, setQueue1] = useState('');
  const [queue2, setQueue2] = useState('');
  const [selectedStation, setSelectedStation] = useState('Station 1');

  const handleChangeStation = (event) => {
    setSelectedStation(event.target.value);
  };


  const stationId = '0'; // Assuming you have a station with ID 'station1'

  // function handleSubmit(e) {
  //   e.preventDefault();

  //   // Update the data in Firebase Realtime Database
  //   const chargingStationsRef = database.ref('chargingStations');

  //   chargingStationsRef.once('value').then((snapshot) => {
  //     const chargingStations = snapshot.val();

  //     if (chargingStations && chargingStations[stationId]) {
  //       // Update Charging Port 1 data if provided
  //       if (grid1 !== '') {
  //         chargingStations[stationId].grids[0].levels = parseInt(grid1, 10) || 0;
  //       }
  //       if (queue1 !== '') {
  //         chargingStations[stationId].grids[0].queue = parseInt(queue1, 10) || 0;
  //       }

  //       // Update Charging Port 2 data if provided
  //       if (grid2 !== '') {
  //         chargingStations[stationId].grids[1].levels = parseInt(grid2, 10) || 0;
  //       }
  //       if (queue2 !== '') {
  //         chargingStations[stationId].grids[1].queue = parseInt(queue2, 10) || 0;
  //       }

  //       // Save the updated data back to Firebase
  //       chargingStationsRef.set(chargingStations);

  //       alert('Successfully updated station data!');
  //     } else {
  //       alert('Error: Charging station not found.');
  //     }
  //   });

  // }

  function handleSubmit(e) {
    e.preventDefault();

    // Map the selected station to the corresponding stationId
    const stationIdMap = {
      'Station 1': '0',
      'Station 2': '1',
      'Station 3': '2',
      // Add more stations as needed
    };

    // Update the data in Firebase Realtime Database
    const chargingStationsRef = database.ref('chargingStations');

    chargingStationsRef.once('value').then((snapshot) => {
      const chargingStations = snapshot.val();

      const stationId = stationIdMap[selectedStation];

      if (chargingStations && chargingStations[stationId]) {
        // Update Charging Port 1 data if provided
        if (grid1 !== '') {
          chargingStations[stationId].grids[0].levels = parseInt(grid1, 10) || 0;
        }
        if (queue1 !== '') {
          chargingStations[stationId].grids[0].queue = parseInt(queue1, 10) || 0;
        }

        // Update Charging Port 2 data if provided
        if (grid2 !== '') {
          chargingStations[stationId].grids[1].levels = parseInt(grid2, 10) || 0;
        }
        if (queue2 !== '') {
          chargingStations[stationId].grids[1].queue = parseInt(queue2, 10) || 0;
        }

        // Save the updated data back to Firebase
        chargingStationsRef.set(chargingStations);

        alert('Successfully updated station data!');
      } else {
        alert('Error: Charging station not found.');
      }
    });
  }


  return (
    <div style={{ color: 'white', backgroundColor: '#001B79', textAlign: 'center', padding: '50px', height: '100vh' }}>
      <h1>EV Station Management</h1>
      <Select value={selectedStation}
        sx={{ minWidth: '200px', '& .MuiTypography-root': { color: '#001B79' }, '& .MuiInputLabel-root': { color: '#001B79' }, '& .MuiSelect-icon': { color: '#001B79' }, textAlign: 'center', background: 'white' }}

        onChange={handleChangeStation} label="Select Station">
        <MenuItem value="Station 1" >Station 1</MenuItem>
        <MenuItem value="Station 2">Station 2</MenuItem>
        <MenuItem value="Station 3">Station 3</MenuItem>
      </Select>
      <TextField
        label="Charging Port 1 Levels"
        variant="outlined"
        type="number"
        inputProps={{ min: 0, max: 100 }}
        value={grid1}
        onChange={(e) => setGrid1(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ '& .MuiTypography-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'white' }, '& .MuiSelect-icon': { color: 'white' }, textAlign: 'center' }}

        InputProps={{
          style: { color: 'white' },
          endAdornment: <InputAdornment position="end" >%</InputAdornment>,
        }}
      />

      <TextField
        label="Queue"
        variant="outlined"
        select
        value={queue1}
        onChange={(e) => setQueue1(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          style: { color: 'white' }
        }}
        sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiSelect-icon': { color: 'white' }, color: 'white' }}

      >
        {[...Array(6).keys()].map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Charging Port 2 Levels"
        variant="outlined"
        type="number"
        inputProps={{ min: 0, max: 100 }}
        value={grid2}
        onChange={(e) => setGrid2(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ '& .MuiTypography-root': { color: 'white' }, '& .MuiInputLabel-root': { color: 'white' }, '& .MuiSelect-icon': { color: 'white' }, textAlign: 'center' }}

        InputProps={{
          style: { color: 'white', textAlign: 'center' },
          endAdornment: <InputAdornment position="end" style={{ color: 'white' }} >%</InputAdornment>,
        }}
      />
      <TextField
        label="Queue"
        variant="outlined"
        select
        value={queue2}
        onChange={(e) => setQueue2(e.target.value)}
        fullWidth
        sx={{ '& .MuiInputLabel-root': { color: 'white' }, '& .MuiSelect-icon': { color: 'white' } }}
        InputProps={{
          style: { color: 'white' }
        }}
        margin="normal"
      >
        {[...Array(6).keys()].map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
      {/* <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginTop: '20px' }}> */}
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleSubmit}>
        Update Data
      </Button>
    </div>
  );
};

export default EvStation;