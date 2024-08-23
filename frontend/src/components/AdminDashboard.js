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
import { FaTools, FaEdit, FaComments } from "react-icons/fa";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { isAuthenticated } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
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
                        top: "500%",
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
                          to="/manage-rooms"
                          activeClassName="activeClicked"
                          style={{
                            textDecoration: "none",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <Card sx={{ width: "100%" }}>
                            <CardContent>
                              <div className="card-icon">
                                <FaTools size={40} />
                              </div>
                              <Typography variant="h5">Manage Rooms</Typography>
                              <Typography variant="body2">
                                Add, update, or delete room details to manage
                                the inventory.
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="primary">
                                See more
                              </Button>
                            </CardActions>
                          </Card>
                        </NavLink>

                        <NavLink
                          exact
                          to="/reports"
                          activeClassName="activeClicked"
                          style={{
                            textDecoration: "none",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <Card sx={{ width: "100%" }}>
                            <CardContent>
                              <div className="card-icon">
                                <FaEdit size={40} />
                              </div>
                              <Typography variant="h5">
                                Admin Reports
                              </Typography>
                              <Typography variant="body2">
                                View statistics
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
                          to="/adminmessaging"
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

export default AdminDashboard;
