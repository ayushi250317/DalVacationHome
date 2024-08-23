import { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { isAuthenticated } from "../services/AuthService";
import { Button } from "@mui/material";

const Reports = () => {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/getUpcomingBookings"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchNumberOfUsers = async () => {
      try {
        const response = await fetch(
          "https://mzlplfrnurs3il43vllomjnrya0gdazu.lambda-url.us-east-1.on.aws"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch number of users");
        }
        const data = await response.json();
        setNumberOfUsers(data.length);
      } catch (error) {
        console.error("Error fetching number of users", error);
      }
    };

    fetchNumberOfUsers();
  }, [numberOfUsers]);

  return (
    <>
      {
        <>
          {!numberOfUsers.length && !bookings.length ? (
            "Loading...."
          ) : isAuthenticated ? (
            <>
              <h1 style={{ marginTop: "16px" }}>
                Total Users: {numberOfUsers}
              </h1>

              <h1 style={{ marginTop: "16px" }}>Upcoming reservations</h1>
              <div className="container mt-4">
                <table className="table table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th>Booking Ref Code</th>
                      <th>Room Number</th>
                      <th>Username</th>
                      <th>End Date</th>
                      <th>Start Date</th>
                      <th>Reservation Date</th>
                      <th>Bed Type</th>
                      <th>Price</th>
                      <th>Discount Code</th>
                      <th>Features</th>
                      <th>Room Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={booking.booking_ref_code}>
                        <td>{booking.booking_ref_code}</td>
                        <td>{booking.room_number}</td>
                        <td>{booking.username}</td>
                        <td>{booking.end_date}</td>
                        <td>{booking.start_date}</td>
                        <td>{booking.reservation_date}</td>
                        <td>{booking.bed_type}</td>
                        <td>{booking.price}</td>
                        <td>{booking.discountcode}</td>
                        <td>{booking.features}</td>
                        <td>{booking.room_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ width: "100%", height: "800px" }}>
                <iframe
                  title="LookerStudio Dashboard"
                  src="https://lookerstudio.google.com/embed/reporting/287ca915-ef1a-4d06-859a-7d50671e6cd2/page/tEnnC"
                  frameBorder="0"
                  allowFullScreen
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </>
          ) : (
            <>
              <LinkContainer to="/signup">
                <Button variant="outline-primary" className="me-2">
                  Sign Up
                </Button>
              </LinkContainer>
              <LinkContainer to="/login">
                <Button variant="outline-success">Login</Button>
              </LinkContainer>
            </>
          )}
        </>
      }
      {/* {isAuthenticated() && numberOfUsers ? (
        <>
          <h1>Total Users: {numberOfUsers}</h1>
          <div style={{ width: "100%", height: "800px" }}>
            <iframe
              title="LookerStudio Dashboard"
              src="https://lookerstudio.google.com/embed/reporting/ca755b5b-5e70-477f-a4e3-9d873a87a540/page/75y5D"
              frameBorder="0"
              allowFullScreen
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </>
      ) : (
        <>
          <LinkContainer to="/signup">
            <Button variant="outline-primary" className="me-2">
              Sign Up
            </Button>
          </LinkContainer>
          <LinkContainer to="/login">
            <Button variant="outline-success">Login</Button>
          </LinkContainer>
        </>
      )} */}
    </>
  );
};

export default Reports;
