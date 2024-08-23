import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { bookingRefCode } = useParams();
  const [adminEmail, setAdminEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');

  useEffect(() => {
    const fetchAdminEmail = () => {
      const idToken = sessionStorage.getItem('idToken');
      if (idToken) {
        const decodedToken = jwtDecode(idToken);
        setAdminEmail(decodedToken.email);
      }
    };

    fetchAdminEmail();
  }, []);

  const fetchMessages = async () => {
    try {
      if (bookingRefCode) {
        const response = await axios.get(`https://us-central1-csci-5410-428021.cloudfunctions.net/getMessages?booking_ref_code=${bookingRefCode}`);
        console.log('API Response all messages:', response.data);
        setMessages(response.data);

        if (response.data.length > 0) {
          setReceiverEmail(response.data[0].sender);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Fetching messages every 5 seconds

    return () => clearInterval(interval); 
  }, [bookingRefCode]);

  const handleSendMessage = async () => {
    try {
      if (bookingRefCode && newMessage.trim() !== '') {
        const response = await axios.post('https://us-central1-csci-5410-428021.cloudfunctions.net/sendmessages', {
          message: newMessage,
          receiver: receiverEmail, 
          booking_ref_code: bookingRefCode,
          username: adminEmail,
        });
        console.log('Message sent:', response.data);

        setMessages([...messages, {
          sender: adminEmail,
          message: newMessage,
          timestamp: new Date().toISOString(),
        }]);

        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Chat Room</Typography>
      <Paper style={{ padding: '20px', marginBottom: '20px', background: '#F5F5F5' }}>
        <div style={{ marginBottom: '20px' }}>
          {messages.map((message, index) => (
            <div key={index} style={{ textAlign: message.sender === adminEmail ? 'right' : 'left', marginBottom: '10px' }}>
              <Paper style={{ background: message.sender === adminEmail ? '#C1E0FF' : '#E7D2FF', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
                <Typography variant="body1">
                  {message.sender}: {message.message}
                </Typography>
                <Typography variant="caption" style={{ color: 'gray' }}>
                  {new Date(message.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            </div>
          ))}
        </div>
        <TextField
          label="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Paper>
    </Container>
  );
};

export default AdminChat;
