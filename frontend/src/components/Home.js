import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { FaSearch, FaCalendarCheck, FaTools } from "react-icons/fa";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { isAuthenticated } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            {isAuthenticated() ? (
              <>
                <Button variant="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              ""
            )}

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {isAuthenticated() ? (
                  <>
                    <Container fluid className="home-page">
                      <Typography variant="h2" gutterBottom>
                        Welcome to DALVacationHome
                      </Typography>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                          <NavLink
                            exact
                            to="/check-availability"
                            activeClassName="activeClicked"
                            style={{ textDecoration: "none" }}
                          >
                            <Card>
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
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <NavLink
                            exact
                            to="/reserve-room"
                            activeClassName="activeClicked"
                            style={{ textDecoration: "none" }}
                          >
                            <Card>
                              <CardContent>
                                <div className="card-icon">
                                  <FaCalendarCheck size={40} />
                                </div>
                                <Typography variant="h5">
                                  Reserve Room
                                </Typography>
                                <Typography variant="body2">
                                  Reserve a room or recreation room for a
                                  specific period.
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button size="small" color="primary">
                                  Learn More
                                </Button>
                              </CardActions>
                            </Card>
                          </NavLink>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <NavLink
                            exact
                            to="/manage-rooms"
                            activeClassName="activeClicked"
                            style={{ textDecoration: "none" }}
                          >
                            <Card>
                              <CardContent>
                                <div className="card-icon">
                                  <FaTools size={40} />
                                </div>
                                <Typography variant="h5">
                                  Manage Rooms
                                </Typography>
                                <Typography variant="body2">
                                  Add, update, or delete room details to manage
                                  the inventory.
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button size="small" color="primary">
                                  Learn More
                                </Button>
                              </CardActions>
                            </Card>
                          </NavLink>
                        </Grid>
                      </Grid>
                    </Container>
                  </>
                ) : (
                  <>
                    <Container fluid className="home-page">
                      <Typography
                        variant="h2"
                        gutterBottom
                        style={{ color: "#2980b9", fontFamily: "Arial, sans-serif" }}
                      >
                        Welcome to DALVacationHome
                      </Typography>
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ color: "#3498db", fontFamily: "Arial, sans-serif" }}
                      >
                        Discover the perfect getaway with our exclusive rooms and
                        recreation facilities. Join us today to enjoy seamless booking
                        and exceptional customer service.
                      </Typography>
                      <LinkContainer to="/signup">
                        <Button variant="outline-primary" className="me-2">
                          Sign Up
                        </Button>
                      </LinkContainer>
                      <LinkContainer to="/login">
                        <Button variant="outline-success">Login</Button>
                      </LinkContainer>
                      <Grid container justifyContent="center" spacing={4} style={{ marginTop: "20px" }}>
                        <Grid item xs={12} md={4}>
                          <NavLink
                            exact
                            to="/guest-availability"
                            activeClassName="activeClicked"
                            style={{ textDecoration: "none" }}
                          >
                            <Card>
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
                        </Grid>
                      </Grid>
                    </Container>
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

export default Home;
