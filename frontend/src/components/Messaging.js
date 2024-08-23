import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Messaging = () => {
  const [email, setEmail] = useState('');
  const [queries, setQueries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const idToken = sessionStorage.getItem('idToken');
    if (idToken) {
      const decodedToken = jwtDecode(idToken);
      setEmail(decodedToken.email);
    }
  }, []);

  useEffect(() => {
    const fetchQueries = async () => {
      if (email) {
        try {
          const response = await axios.get(`https://us-central1-csci-5410-428021.cloudfunctions.net/getCustomerQueries?username=${email}`);
          console.log('API Response:', response.data);
          setQueries(response.data);
        } catch (error) {
          console.error('Error fetching customer queries:', error);
        }
      }
    };

    fetchQueries();
  }, [email]);

  const handleChatClick = (bookingRefCode) => {
    console.log('Navigating to Chat with bookingRefCode:', bookingRefCode);
    navigate(`/chat/${bookingRefCode}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Raised Tickets</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Agent</TableCell>
              <TableCell>Query</TableCell>
              <TableCell>Booking Reference Code</TableCell>
              <TableCell>Chat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query, index) => (
              <TableRow key={index}>
                <TableCell>{query.agent}</TableCell>
                <TableCell>{query.query}</TableCell>
                <TableCell>{query.booking_ref_code}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleChatClick(query.booking_ref_code)}
                  >
                    Chat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Messaging;
