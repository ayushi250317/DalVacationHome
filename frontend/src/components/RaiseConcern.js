import React from "react";
import { useEffect, useState } from "react";
import { raiseConcern } from "../services/ReviewsAndRatingsServices";
import Rating from "@mui/material/Rating";
import { TextField, Button, CircularProgress } from "@mui/material";
import { fetchBookingsByUser } from "../services/ReviewsAndRatingsServices";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RaiseConcern = () => {
  const [concern, setConcern] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //   const [addReviewClicked, setAddReviewClicked] = useState(false);
  const location = useLocation();
  const booking_ref_code = location.state;
  const navigate= useNavigate();

  const handleAddReview = async () => {
    if (!concern.trim()) {
      window.alert("Please enter message");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        message: concern,
        booking_ref_code: booking_ref_code,
      };

      await raiseConcern(payload);

      //   fetchReviewsData();
      setConcern("");
      window.alert("Message sent successfully!");
      navigate("/my-bookings")
      //   setAddReviewClicked(false);
    } catch (error) {
      console.error("Error sending message:", error);
      window.alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <>
      <h1>Write your message here</h1>

      <div className="mt-4">
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          multiline
          rows={3}
          sx={{ maxWidth: 400 }}
          required={true}
        />

        <div className="mt-2">
          <Button variant="contained" color="primary" onClick={handleAddReview}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Raise concern"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default RaiseConcern;
