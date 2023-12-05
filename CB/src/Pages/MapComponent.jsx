import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Fab,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { app, database } from '../firebase'; // Update the correct path to your firebase.js file

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [chargingStations, setChargingStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const mapRef = useRef(null);
  const apiKey = '5b3ce3597851110001cf6248816ced6b325f4473aead4fd162903ccc';

  const { phoneNumber } = useParams();

  const defaultLocation = [51.5074, -0.1278]; // Default location (London, UK) for reference

  const busIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/color/48/bus.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const chargingStationIcon = new L.Icon({
    iconUrl:
      'https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-charging-station-personal-transportation-flaticons-flat-flat-icons-2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation([latitude, longitude]);

              // Generate random charging stations around the current location
              const newChargingStations = generateRandomChargingStations([latitude, longitude], 0.01, 3);
              setChargingStations(newChargingStations);

              // Update charging station data to Firebase Realtime Database
              await updateChargingStationsToFirebase(newChargingStations);
            },
            (error) => {
              console.error('Geolocation error:', error);
              setCurrentLocation(defaultLocation);
            }
          );
        } else {
          setCurrentLocation(defaultLocation);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();


    // Set up a listener for real-time updates
    const chargingStationsRef = database.ref('chargingStations');
    chargingStationsRef.on('value', (snapshot) => {
      const updatedChargingStations = snapshot.val();
      if (updatedChargingStations) {
        setChargingStations(updatedChargingStations);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => chargingStationsRef.off('value');

  }, []);

  const generateRandomChargingStations = (center, maxDistance, numStations) => {
    const stations = [];
    for (let i = 1; i <= numStations; i++) {
      const lat = center[0] + (Math.random() * 2 - 1) * maxDistance;
      const lng = center[1] + (Math.random() * 2 - 1) * maxDistance;
      const name = `Station ${i}`;
      const grids = generateChargingGrids();
      stations.push({ name, coordinates: [lat, lng], grids });
    }
    return stations;
  };

  const generateChargingGrids = () => {
    const grids = [];
    const numGrids = 2; // Always generate two grids per station
    for (let i = 1; i <= numGrids; i++) {
      const levels = Math.floor(Math.random() * 101); // Random charge level from 0 to 100
      const queue = Math.floor(Math.random() * 6); // Random queue from 0 to 5
      grids.push({ grid: i, levels, queue });
    }
    return grids;
  };

  const updateChargingStationsToFirebase = async (chargingStations) => {
    try {
      // Get a reference to the charging stations in the database
      const chargingStationsRef = database.ref('chargingStations');

      // Set the charging stations data in the database
      await chargingStationsRef.set(chargingStations);
      console.log('Charging stations data updated to Firebase');
    } catch (error) {
      console.error('Error updating charging stations data to Firebase:', error);
    }
  };


  const relocateBusToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        // Center the map on the new location
        mapRef.current.setView([latitude, longitude], 13);
      });
    }
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  // Sort charging stations by distance to the bus
  const sortedStations = chargingStations.slice().sort((stationA, stationB) => {
    const distanceA = L.latLng(currentLocation).distanceTo(L.latLng(stationA.coordinates));
    const distanceB = L.latLng(currentLocation).distanceTo(L.latLng(stationB.coordinates));
    return distanceA - distanceB;
  });

  const [isBookModalOpen, setBookModalOpen] = useState(false);
  const [isFullModalOpen, setFullModalOpen] = useState(false);

  const handleBookNow = (grid) => {
    setBookModalOpen(true);
    setSelectedGrid(grid);
  };

  const handleGridClick = (grid) => {
    setBookModalOpen(true);
    setSelectedGrid(grid);

  };

  function slotFull(e) {
    setFullModalOpen(true)
    // alert("Queue is Full, Please Check back after sometime !!")
  }


  const [orderId, setOrderId] = useState(null);

  const handleConfirmBooking = () => {
    if (!selectedStation || !selectedGrid) {
      console.error('Selected station or grid is null or undefined.');
      return;
    }

    if (selectedGrid.queue >= 5) {
      // Queue is full, show modal
      setFullModalOpen(true);
      setBookModalOpen(false);
      return;
    }

    const updatedStations = chargingStations.map((station) => {
      if (station.name === selectedStation.name) {
        const updatedGrids = station.grids.map((grid) => {
          if (grid.grid === selectedGrid.grid) {
            return {
              ...grid,
              queue: grid.queue + 1,
            };
          }
          return grid;
        });

        return {
          ...station,
          grids: updatedGrids,
        };
      }
      return station;
    });

    // Generate a random order ID
    const newOrderId = Math.floor(Math.random() * 1000000);
    setOrderId(newOrderId);

    // Close the booking modal
    setBookModalOpen(false);
  };

  // Handle orderId changes to show the success message
  useEffect(() => {
    if (orderId !== null) {
      // Show success message with order ID
      alert(`Successfully booked the slot in the queue!\nOrder ID: ${orderId}`);
    }
  }, [orderId]);



  return (
    <div style={{ textAlign: 'left' }}>
      <MapContainer attributionControl={false} center={currentLocation || defaultLocation} zoom={14} style={{ width: '100%', height: '500px' }} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=''
        />
        {currentLocation && (
          <Marker position={currentLocation} icon={busIcon}>
            <Popup>Your Current Location (Bus)</Popup>
          </Marker>
        )}
        {chargingStations.map((station, index) => (
          <Marker
            key={index}
            position={station.coordinates}
            icon={chargingStationIcon}
            eventHandlers={{ click: () => handleStationClick(station) }}
          >
            <Popup>
              {station.name}
              <br />
              Distance: {L.latLng(currentLocation).distanceTo(L.latLng(station.coordinates)).toFixed(2)} meters
            </Popup>
          </Marker>
        ))}
        {selectedStation && (
          <Marker position={selectedStation.coordinates} icon={chargingStationIcon}>
            <Popup>
              {selectedStation.name}
              <br />
              Distance: {L.latLng(currentLocation).distanceTo(L.latLng(selectedStation.coordinates)).toFixed(2)} meters
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div style={{ textAlign: 'center', position: 'absolute', top: '70px', right: '20px' }}>
        <Fab color="primary" onClick={relocateBusToCurrentLocation}>
          <MyLocationIcon />
        </Fab>
      </div>
      <div style={{ textAlign: 'left', textJustify: 'justify', padding: '20px' }}>
        <h3 style={{ color: '', textAlign: 'center' }}>Nearby Charging Stations</h3>
        <List>
          {sortedStations.map((station, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`station-${index}-content`} id={`station-${index}-header`}>
                <Typography sx={{ fontWeight: '700' }}>{station.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Distance: {L.latLng(currentLocation).distanceTo(L.latLng(station.coordinates)).toFixed(2)} meters
                </Typography>
                <List>
                  {station.grids.map((grid, gridIndex) => (
                    <ListItem key={gridIndex}>
                      <ListItemText
                        primary={`Charging Port ${grid.grid}`}
                        secondary={
                          <Typography component="div" variant="body2">
                            Charging Level: {grid.levels}% <br />
                            Queue: {grid.queue}
                          </Typography>
                        }
                      />
                      {grid.queue < 5 ? (
                        <Button variant="contained" color="success" onClick={() => handleGridClick(grid)}>
                          Book Now
                        </Button>
                      ) : (
                        <Button variant="contained" color="error" onClick={slotFull}>
                          Book Now
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </div>

      {/* Book Now Modal */}
      <Dialog open={isBookModalOpen} onClose={() => setBookModalOpen(false)}>
        {/* <DialogTitle>Confirm Booking</DialogTitle> */}
        <DialogContent>
          <Typography>
            Are you sure you want to book this slot?
          </Typography>
          <TextField label="Mobile Number" value={phoneNumber} sx={{ mt: 3 }} disabled fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookModalOpen(false)}>Cancel</Button>
          {/* <Button onClick={handleConfirmBooking} color="primary">Confirm Booking</Button> */}
          <Button onClick={() => { setBookModalOpen(false); alert(`Booking successful. || Booking ID: ${Math.floor(Math.random() * 1000000)} `); }} color="primary">Confirm Booking</Button>
        </DialogActions>
      </Dialog>

      {/* Full Queue Modal */}
      <Dialog open={isFullModalOpen} onClose={() => setFullModalOpen(false)}>
        <DialogTitle>Queue Full</DialogTitle>
        <DialogContent>
          <Typography>
            Sorry, the queue is full. Please try again later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFullModalOpen(false)} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MapComponent;