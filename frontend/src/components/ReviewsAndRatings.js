import React from "react";
import { useEffect, useState } from "react";
import { fetchReviews, addReview } from "../services/ReviewsAndRatingsServices";
import { useLocation } from "react-router-dom";

const ReviewsAndRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  const roomNumber = location.state;
  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const payload = { roomNumber: roomNumber };

        const { status, data: reviewsData } = await fetchReviews(payload);
        if (status === 200) {
          if (reviewsData.length === 0) {
            window.alert("No reviews found!");
            setError(true);
          }
          setReviews(reviewsData);
        } else {
          window.alert("Something went wrong, try again.");
          setError(true);
        }
      } catch (error) {
        if (error.status === 400) {
          window.alert("Please check the information and try again.");
        } else {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchReviewsData();
  }, []);

  return (
    <>
      {reviews.length === 0 && !error ? (
        "Loading..."
      ) : (
        <>
          <div className="container mt-4">
            <h2 className="mb-4">Customer Reviews</h2>
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Review</th>
                  <th scope="col">User Rating</th>
                  <th scope="col">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((feedback, index) => (
                  <tr key={index}>
                    <td>
                      {feedback.data.given_name +
                        " " +
                        feedback.data.family_name}
                    </td>
                    <td>{feedback.data.text}</td>
                    <td>{feedback.data.rating}</td>
                    <td>{feedback.data.sentiment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <h1>You can give your feedback here!</h1>

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
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddReview}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add Review"
                )}
              </Button>
            </div>
          </div> */}
        </>
      )}
    </>
  );
};

export default ReviewsAndRatings;
