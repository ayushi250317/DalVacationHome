import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { securityQuestionAuthChallenge } from '../services/AuthService';

const SecurityQuestion = () => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();
  const { oneFAResponse, email } = state;
  const challengeParameters = oneFAResponse.ChallengeParameters;
  const handleAnswer = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const response = await securityQuestionAuthChallenge(email, oneFAResponse.Session, answer);
        console.log(response);
        navigate("/decrypt-cipher", { state: { twoFAResponse: response, email } });
    } catch {
      // Failed verification
      setError('Incorrect answer to the security question. Please restart login process.');
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/login");
    }
  };

  return (
    <Container>
      <Row>
        <Col style={{ textAlign: 'left' }} md={{ span: 4, offset: 4 }}>
          <h2>Security Question</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleAnswer}>
            <Form.Group controlId="formSecurityAnswer">
              <Form.Label>Security Question: {challengeParameters.securityQuestion}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </Form.Group>

            <Button className='mt-2' variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SecurityQuestion;