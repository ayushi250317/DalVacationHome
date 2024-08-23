import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Snackbar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Alert } from "@mui/material";
import axios from "axios";

//Property agents can add, update or delete rooms
const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    room_number: "",
    room_type: "",
    room_name: "",
    features: "",
    price: 0,
    discountcode: "",
  });
  const [editRoom, setEditRoom] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/getRooms"
        );
        if (response.status === 200) {
          setRooms(response.data);
        }
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to fetch rooms",
          severity: "error",
        });
      }
    };

    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prevRoom) => ({ ...prevRoom, [name]: value }));
  };

  const handleAddRoom = async () => {
    const { room_number, room_type, room_name, features, price, discountcode } =
      newRoom;
    if (
      !room_number ||
      !room_type ||
      !room_name ||
      !features ||
      !price ||
      !discountcode
    ) {
      setNotification({
        open: true,
        message: "Please fill out all fields",
        severity: "warning",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/addRoom",
        {
          room_number,
          room_type,
          room_name,
          features,
          price,
          discountcode,
        }
      );

      if (response.status === 200) {
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        setNotification({
          open: true,
          message: "Room added successfully",
          severity: "success",
        });
        setNewRoom({
          room_number: "",
          room_type: "",
          room_name: "",
          features: "",
          price: 0,
          discountcode: "",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to add room",
        severity: "error",
      });
    }
  };

  const handleDeleteRoom = async (roomNumber) => {
    try {
      const response = await axios.delete(
        `https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/deleteRoom/${roomNumber}`
      );

      if (response.status === 200) {
        setRooms((prevRooms) =>
          prevRooms.filter((room) => room.room_number !== roomNumber)
        );
        setNotification({
          open: true,
          message: "Room deleted successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to delete room",
        severity: "error",
      });
    }
  };

  const handleEditRoom = (room) => {
    setEditRoom(room);
    setNewRoom(room);
  };

  const handleUpdateRoom = async () => {
    const { room_number, room_type, room_name, features, price, discountcode } =
      newRoom;
    if (
      !room_number ||
      !room_type ||
      !room_name ||
      !features ||
      !price ||
      !discountcode
    ) {
      setNotification({
        open: true,
        message: "Please fill out all fields",
        severity: "warning",
      });
      return;
    }

    try {
      const response = await axios.put(
        `https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/editRoom/${room_number}`,
        {
          newRoom,
        }
      );

      if (response.status === 200) {
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.room_number === editRoom.room_number ? newRoom : room
          )
        );
        setNotification({
          open: true,
          message: "Room updated successfully",
          severity: "success",
        });
        setNewRoom({
          room_number: "",
          room_type: "",
          room_name: "",
          features: "",
          price: 0,
          discountcode: "",
        });
        setEditRoom(null);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update room",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: "", severity: "" });
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Manage Rooms
      </Typography>
      <Grid container spacing={2}>
        {rooms.map((room, index) => (
          <Grid item key={index} xs={12} md={4}>
            <Card>
              <CardContent>
                <div className="card-icon">
                  <FaHome size={40} />
                </div>
                <Typography variant="h5">Room {room.room_number}</Typography>
                <Typography variant="h5">{room.room_name}</Typography>
                <Typography variant="body2">{room.features}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleEditRoom(room)}
                  startIcon={<FaEdit />}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDeleteRoom(room.room_number)}
                  startIcon={<FaTrash />}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Room Number"
            name="room_number"
            value={newRoom.room_number}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Room Type</InputLabel>
            <Select
              label="Room Type"
              name="room_type"
              value={newRoom.room_type}
              onChange={handleInputChange}
            >
              <MenuItem value="normal_room">Normal Room</MenuItem>
              <MenuItem value="recreational_room">Recreational Room</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Room Name"
            name="room_name"
            value={newRoom.room_name}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Features"
            name="features"
            value={newRoom.features}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Price"
            name="price"
            type="number"
            value={newRoom.price}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Discount Code"
            name="discountcode"
            value={newRoom.discountcode}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {editRoom ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaEdit />}
              onClick={handleUpdateRoom}
              fullWidth
            >
              Update Room
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaPlus />}
              onClick={handleAddRoom}
              fullWidth
            >
              Add Room
            </Button>
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageRooms;
