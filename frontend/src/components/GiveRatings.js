import React from "react";
import { useEffect, useState } from "react";
import { addReview } from "../services/ReviewsAndRatingsServices";
import Rating from "@mui/material/Rating";
import { TextField, Button, CircularProgress } from "@mui/material";
import { fetchBookingsByUser } from "../services/ReviewsAndRatingsServices";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const GiveRatings = () => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //   const [addReviewClicked, setAddReviewClicked] = useState(false);
  const location = useLocation();
  const roomNumber = location.state;
  const navigate=useNavigate();

  const handleAddReview = async () => {
    if (!review.trim() || rating === 0) {
      window.alert("Please enter Reviews and Ratings");
      return;
    }

    setLoading(true);
    try {
      const newReview = {
        rating: rating,
        text: review,
        given_name: sessionStorage.getItem("given_name"),
        family_name: sessionStorage.getItem("family_name"),
        roomNumber: roomNumber,
      };

      await addReview(newReview);

      //   fetchReviewsData();
      setReview("");
      window.alert("Review added successfully!");
      navigate("/my-bookings");
      //   setAddReviewClicked(false);
    } catch (error) {
      console.error("Error adding review:", error);
      window.alert("Failed to add review. Please try again later.");
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <>
      <h1>You can give your feedback here!</h1>

      <div className="mt-4">
        <TextField
          label="Review"
          variant="outlined"
          fullWidth
          value={review}
          onChange={(e) => setReview(e.target.value)}
          multiline
          rows={3}
          sx={{ maxWidth: 400 }}
          required={true}
        />
        <div className="mt-2">
          <Rating
            value={rating}
            name="half-rating-read"
            // defaultValue={4.5}
            precision={0.5}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </div>
        <div className="mt-2">
          <Button variant="contained" color="primary" onClick={handleAddReview}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Review"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default GiveRatings;
