import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Grid, Card, CardContent, Typography, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CheckAvailability = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roomType, setRoomType] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const idToken = sessionStorage.getItem("idToken");
    if (idToken) {
      const decodedToken = jwtDecode(idToken);
      setEmail(decodedToken.email);
    }
  }, []);

  const fetchAvailableRooms = async (startDate, endDate) => {
    if (!startDate || !endDate || !roomType) {
      alert('Please select start date, end date, and room type.');
      return;
    }

    const formattedStartDate = format(new Date(`${startDate}T12:00:00`), 'MM-dd-yyyy');
    const formattedEndDate = format(new Date(`${endDate}T12:00:00`), 'MM-dd-yyyy');

    try {
      const response = await axios.get(
        `https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/getAvailableRooms/query?start_date=${formattedStartDate}&end_date=${formattedEndDate}&room_type=${roomType}`
      );

      if (response.status === 200) {
        const roomsData = response.data.rooms || response.data;
        console.log('Rooms data fetched:', roomsData);
        setAvailableRooms(roomsData);

        if (roomsData.length === 0) {
          setSnackbarMessage('No available rooms for the selected dates and room type.');
          setSnackbarSeverity('info');
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setSnackbarMessage('Failed to fetch available rooms.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCheckAvailability = () => {
    fetchAvailableRooms(startDate, endDate);
  };

  const handleReserveRoom = async (roomNumber) => {
    const reservationDetails = {
      room_number: roomNumber,
      start_date: format(new Date(startDate), 'MM/dd/yyyy'),
      end_date: format(new Date(endDate), 'MM/dd/yyyy'),
      reservation_date: format(new Date(), 'MM/dd/yyyy'),
      username: email,
    };

    try {
      const response = await axios.post(
        'https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/bookRoomRequest',
        reservationDetails
      );

      if (response.status === 200) {
        setSnackbarMessage('Room reserved successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        await fetchAvailableRooms(startDate, endDate);
      } else {
        setSnackbarMessage('Failed to reserve room.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error reserving room:', error);
      setSnackbarMessage('Failed to reserve room.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Check Room Availability</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Room Type</InputLabel>
            <Select
              label="Room Type"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <MenuItem value="normal_room">Normal Room</MenuItem>
              <MenuItem value="recreational_room">Recreational Room</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleCheckAvailability}>
            Check Availability
          </Button>
        </Grid>
      </Grid>
      {availableRooms.length > 0 && (
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          {availableRooms.map((room, index) => {
            const roomData = room.newRoom || room;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Room Number: {roomData.room_number}
                    </Typography>
                    <Typography variant="body2">Room: {roomData.room_name}</Typography>
                    <Typography variant="body2">Features: {roomData.features}</Typography>
                    <Typography variant="body2">Price: ${roomData.price}</Typography>
                    <Typography variant="body2">Discount Code: {roomData.discountcode}</Typography>
                    <Typography variant="body2">Email: {email}</Typography>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleReserveRoom(roomData.room_number)}
                      style={{ marginTop: '10px' }}
                    >
                      Reserve
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate("/reviews", { state: roomData.room_number })}
                      style={{ marginTop: "10px", marginLeft: "12px" }}
                    >
                      REVIEWS
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CheckAvailability;
