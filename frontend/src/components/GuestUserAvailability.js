import React, { useState} from 'react';
import { Container, TextField, Button, Grid, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const GuestUserAvailability = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roomType, setRoomType] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const navigate = useNavigate();

  const handleCheckAvailability = async () => {
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Check Available Rooms</Typography>
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

export default GuestUserAvailability;
