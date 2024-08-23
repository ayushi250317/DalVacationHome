import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { caesarCipherAuthChallenge, confirmLogin } from '../services/AuthService';

const DecryptPassphrase = () => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { state } = useLocation();
  const { twoFAResponse, email } = state;
  const navigate = useNavigate();

  const handleDecrypt = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log(email);
      const response = await caesarCipherAuthChallenge(email, twoFAResponse.Session, inputText);
      setSuccess('Decryption verified successfully! You will be redirected.');
      console.log(response);
      confirmLogin(response);
      setTimeout(() => {
      const userType = sessionStorage.getItem("userType");
      console.log("Retrieved userType:", userType);
        if (userType === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 2000);
    } catch (error) {
      setError('Incorrect decryption key or passphrase. Please restart login process.');
      console.log(error);
      setSuccess('');
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/login");
    }
  };

  return (
    <Container>
      <Row>
        <Col style={{ textAlign: 'left' }} md={{ span: 4, offset: 4 }}>
          <h2>Decrypt Passphrase</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleDecrypt}>
            <Form.Group controlId="formInputText">
              <Form.Label>Solve the cipher: {twoFAResponse.ChallengeParameters.caesarPassphrase}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter decrypted text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                required
              />
            </Form.Group>

            <Button className="mt-3" variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DecryptPassphrase;
