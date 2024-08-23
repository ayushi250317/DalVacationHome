import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Grid, Card, CardContent, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';


const ReserveRoom = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const idToken = sessionStorage.getItem("idToken");
    if (idToken) {
      console.log("Access Token:", idToken);
      const decodedToken = jwtDecode(idToken);
      console.log("decoded",decodedToken.email);
      setEmail(decodedToken.email);
    }
  }, []);

  const handleReserveRoom = async () => {
    if (!roomNumber || !startDate || !endDate || !reservationDate || !email) {
      alert('Please fill out all fields.');
      return;
    }

    const reservationDetails = {
      room_number: roomNumber,
      start_date: format(new Date(startDate), 'MM/dd/yyyy'),
      end_date: format(new Date(endDate), 'MM/dd/yyyy'),
      reservation_date: format(new Date(reservationDate), 'MM/dd/yyyy'),
      email: email,
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
      <Typography variant="h4" gutterBottom>Reserve a Room</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </Grid>
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
          <TextField
            fullWidth
            label="Reservation Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleReserveRoom}>
            Reserve
          </Button>
        </Grid>
      </Grid>
      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h6">Reservation Details</Typography>
          <Typography variant="body2">Room Number: {roomNumber}</Typography>
          <Typography variant="body2">Start Date: {startDate}</Typography>
          <Typography variant="body2">End Date: {endDate}</Typography>
          <Typography variant="body2">Reservation Date: {reservationDate}</Typography>
          <Typography variant="body2">Email: {email}</Typography>
        </CardContent>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReserveRoom;
