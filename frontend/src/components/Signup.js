import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { signUp } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [cipherKey, setCipherKey] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();
  const securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother’s maiden name?",
    "What was the make of your first car?",
    "What is your favorite book?",
    "What city were you born in?",
    "What was the name of your first school?",
    "What is your favorite food?",
    "What is your childhood nickname?",
    "What is your favorite movie?",
    "What was the name of the street you grew up on?"
  ];

  const handleSignup = async (e) => {
    e.preventDefault();
    // Add signup logic here
    console.log(
      "First Name:",
      firstName,
      "Last Name:",
      lastName,
      "Email:",
      email,
      "Security Question:",
      securityQuestion,
      "Security Answer:",
      securityAnswer,
      "Caesar Cipher Key:",
      cipherKey,
      "User type:",
      userType
    );
    try {
      await signUp(
        email,
        password,
        firstName,
        lastName,
        securityQuestion,
        securityAnswer,
        cipherKey,
        userType
      );
      alert(
        "Signup success. Please confirm notification subscription in your email!"
      );
      navigate("/login");
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    }
  };

  return (
    <Container>
      <Row>
        <Col style={{ textAlign: "left" }} md={{ span: 4, offset: 4 }}>
          <h2>Signup</h2>
          <Form onSubmit={handleSignup}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSecurityQuestion">
              <Form.Label>Security Question</Form.Label>
              <Form.Select
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                required
              >
                <option value="">Select security question</option>
                {securityQuestions.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formSecurityAnswer">
              <Form.Label>Security Answer</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter security answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCipherKey">
              <Form.Label>Caesar Cipher Key</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Caesar Cipher Key"
                value={cipherKey}
                onChange={(e) => setCipherKey(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPasswordConfirmation">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formUserType">
              <Form.Label>User Type</Form.Label>
              <Form.Select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select user type</option>
                <option value="admin">Admin</option>
                <option value="user">Normal</option>
              </Form.Select>
            </Form.Group>

            <Button className="mt-3" variant="primary" type="submit">
              Signup
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
