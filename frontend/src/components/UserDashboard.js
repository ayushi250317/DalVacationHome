import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { FaSearch, FaStar, FaComments } from "react-icons/fa";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { isAuthenticated } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <>
      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">DalVacationHome</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {isAuthenticated() ? (
                  <>
                    <Button variant="primary" onClick={handleLogout}>
                      Logout
                    </Button>
                    <Container
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "600%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: 500,
                        width: "100%",
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <NavLink
                          exact
                          to="/check-availability"
                          activeClassName="activeClicked"
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <Card sx={{ width: "100%", marginTop: 2 }}>
                            <CardContent>
                              <div className="card-icon">
                                <FaSearch size={40} />
                              </div>
                              <Typography variant="h5">
                                Check Availability
                              </Typography>
                              <Typography variant="body2">
                                Easily check the availability of
                                different types of rooms.
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="primary">
                                Learn More
                              </Button>
                            </CardActions>
                          </Card>
                        </NavLink>
                        <NavLink
                          exact
                          to="/my-bookings"
                          activeClassName="activeClicked"
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <Card sx={{ width: "100%", marginTop: 2 }}>
                            <CardContent>
                              <div className="card-icon">
                                <FaStar size={40} />
                              </div>
                              <Typography variant="h5">My Bookings</Typography>
                              <Typography variant="body2">
                                Your previous bookings with us!
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="primary">
                                Learn More
                              </Button>
                            </CardActions>
                          </Card>
                        </NavLink>

                        <NavLink
                          exact
                          to="/messaging"
                          activeClassName="activeClicked"
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <Card sx={{ width: "100%", marginTop: 2 }}>
                            <CardContent>
                              <div className="card-icon">
                                <FaComments size={40} />
                              </div>
                              <Typography variant="h5">Queries</Typography>
                              <Typography variant="body2">
                                Send and receive query details.
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="primary">
                                Learn More
                              </Button>
                            </CardActions>
                          </Card>
                        </NavLink>
                        <NavLink
                          exact
                          to="/searching"
                          activeClassName="activeClicked"
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <Card sx={{ width: "100%", marginTop: 2 }}>
                            <CardContent>
                              <div className="card-icon">
                                <FaComments size={40} />
                              </div>
                              <Typography variant="h5">
                                Filter Booking
                              </Typography>
                              <Typography variant="body2">
                                Enter your booking reference code to search for
                                details.
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="primary">
                                Learn More
                              </Button>
                            </CardActions>
                          </Card>
                        </NavLink>
                      </Box>
                    </Container>
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
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
};

export default UserDashboard;
