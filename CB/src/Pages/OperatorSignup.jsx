import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const OperatorSignup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gridCount, setGridCount] = useState(0);

  const handleLogin = () => {
    // Implement Firebase authentication logic for operators here.
  };

  const handleGridCountChange = (event) => {
    setGridCount(event.target.value);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          Charging Station Operator Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel id="grid-count-label">Number of Grids</InputLabel>
          <Select
            labelId="grid-count-label"
            id="grid-count"
            value={gridCount}
            onChange={handleGridCountChange}
            label="Number of Grids"
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Log In
        </Button>
        <Typography>
          Don't have an account? <Link to="/operator/signup">Sign up</Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OperatorSignup;
