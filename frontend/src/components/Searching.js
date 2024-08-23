import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import axios from "axios";

const Searching = () => {
  const [bookingRefCode, setBookingRefCode] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/bookingInfo/${bookingRefCode}`
      );
      setBookingDetails(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setError("Failed to fetch booking details. Please check the reference code and try again.");
      setBookingDetails(null);
    }
  };

  return (
    <Container
      style={{
        maxWidth: 500,
        marginTop: 20,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h5">Search Booking</Typography>
            <Typography variant="body2">
              Enter your booking reference code to search for details.
            </Typography>
            <TextField
              label="Booking Reference Code"
              variant="outlined"
              fullWidth
              margin="normal"
              value={bookingRefCode}
              onChange={(e) => setBookingRefCode(e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </CardActions>
        </Card>

        {error && (
          <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}

        {bookingDetails && (
          <Card sx={{ width: "100%", marginTop: 2 }}>
            <CardContent>
              <Typography variant="h6">Booking Details</Typography>
              <Typography variant="body2">
                <strong>Room Number:</strong> {bookingDetails.room_number}
              </Typography>
              <Typography variant="body2">
                <strong>Room Type:</strong> {bookingDetails.bed_type}
              </Typography>
              <Typography variant="body2">
                <strong>Start Date:</strong> {bookingDetails.start_date}
              </Typography>
              <Typography variant="body2">
                <strong>End Date:</strong> {bookingDetails.end_date}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default Searching;
