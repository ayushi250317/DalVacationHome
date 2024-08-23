import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { login } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    setError("");
    try {
      const response = await login(email, password);
      navigate("/security-question", {
        state: { oneFAResponse: response, email: email },
      });
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <h2>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "left" }} md={{ span: 4, offset: 4 }}>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button className="mt-3" variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
