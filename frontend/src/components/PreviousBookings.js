import React from "react";
import { useEffect, useState } from "react";
import { addReview } from "../services/ReviewsAndRatingsServices";
import Rating from "@mui/material/Rating";
import { TextField, Button, CircularProgress } from "@mui/material";
import { fetchBookingsByUser } from "../services/ReviewsAndRatingsServices";
import { useNavigate } from "react-router-dom";

const PreviousBookings = () => {
  const navigate = useNavigate();

  const [previousBookings, setPreviousBookings] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [addReviewClicked, setAddReviewClicked] = useState(false);
  // const [roomNumber, setRoomNumber] = useState(null);

  useEffect(() => {
    const fetchPreviousBookings = async () => {
      try {
        const { status, data: bookings } = await fetchBookingsByUser(
          sessionStorage.getItem("email")
        );
        if (status === 404) {
          window.alert("No bookings found!");
          setError(true);
        }
        setPreviousBookings(bookings);
      } catch (error) {
        if (error.status === 400) {
          window.alert("Please check the information and try again.");
        } else {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchPreviousBookings();
  }, []);

  //   useEffect(() => {
  //     fetchReviewsData();
  //   }, []);

  // const handleAddReview = async () => {
  //   if (!review.trim() || rating === 0) {
  //     window.alert("Please enter Reviews and Ratings");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const newReview = {
  //       rating: rating,
  //       text: review,
  //       given_name: sessionStorage.getItem("given_name"),
  //       family_name: sessionStorage.getItem("family_name"),
  //       roomNumber: roomNumber,
  //     };

  //     await addReview(newReview);

  //     //   fetchReviewsData();
  //     setReview("");
  //     window.alert("Review added successfully!");
  //     setAddReviewClicked(false);
  //   } catch (error) {
  //     console.error("Error adding review:", error);
  //     window.alert("Failed to add review. Please try again later.");
  //   } finally {
  //     setLoading(false); // Set loading state back to false
  //   }
  // };

  return (
    <>
      {previousBookings.length === 0 && !error ? (
        "Loading..."
      ) : (
        <>
          <div className="container mt-4">
            <h2 className="mb-4">All Bookings</h2>
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Room Number</th>
                  <th scope="col">Room Type</th>
                  <th scope="col">Booking Reference Code</th>
                  <th scope="col">Room Name</th>
                  <th scope="col">Amount Paid</th>
                  <th scope="col">Rate this booking</th>
                  <th scope="col">Raise a concern</th>
                </tr>
              </thead>
              <tbody>
                {previousBookings.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.room_number}</td>
                    <td>{booking.room_type}</td>
                    <td>{booking.booking_ref_code}</td>
                    <td>{booking.room_name}</td>
                    <td>{booking.price}</td>
                    <td scope="col">
                      <button
                        onClick={() =>
                          navigate("/give-ratings", {
                            state: booking.room_number,
                          })
                        }
                      >
                        Rate this booking
                      </button>
                    </td>
                    <td scope="col">
                      <button
                        onClick={() =>
                          navigate("/raise-concern", {
                            state: booking.booking_ref_code,
                          })
                        }
                      >
                        Raise concern
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default PreviousBookings;
