// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CheckAvailability from "./components/CheckAvailability";
import ReserveRoom from "./components/ReserveRoom";
import ManageRooms from "./components/ManageRooms";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SecurityQuestion from "./components/SecurityQuestion";
import DecryptPassphrase from "./components/DecryptPassphrase";
import ReviewsAndRatings from "./components/ReviewsAndRatings";
import Reports from "./components/Reports";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Messaging from "./components/Messaging";
import AdminMessaging from "./components/AdminMessaging";
import Chat from "./components/Chat";
import AdminChat from "./components/AdminChat";
import Searching from "./components/Searching";
import PreviousBookings from "./components/PreviousBookings";
import GiveRatings from "./components/GiveRatings";
import GuestUserAvailability from "./components/GuestUserAvailability";
import RaiseConcern from "./components/RaiseConcern";
import { FaRocketchat } from "react-icons/fa";

function App() {
  const [iframeSrc, setIframeSrc] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false); // State for visibility

  useEffect(() => {
    const updateIframeSrc = () => {
      const token = sessionStorage.getItem("accessToken");
      const appId = token
        ? "246e64da8162bae8f6d071c86c108dd39"
        : "370269d0d4f03496c4c712ef551fed164";
      setIframeSrc(`https://widget.kommunicate.io/chat?appId=${appId}`);
    };

    // Initial setup
    updateIframeSrc();

    // Event listener
    window.addEventListener("authChange", updateIframeSrc);

    return () => {
      window.removeEventListener("authChange", updateIframeSrc);
    };
  }, []);

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/security-question" element={<SecurityQuestion />} />
            <Route path="/decrypt-cipher" element={<DecryptPassphrase />} />
            <Route path="/check-availability" element={<CheckAvailability />} />
            <Route path="/reserve-room" element={<ReserveRoom />} />
            <Route path="/manage-rooms" element={<ManageRooms />} />
            <Route path="/reviews" element={<ReviewsAndRatings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/messaging" element={<Messaging />} />
            <Route path="/chat/:bookingRefCode" element={<Chat />} />
            <Route path="/adminmessaging" element={<AdminMessaging />} />
            <Route path="/adminchat/:bookingRefCode" element={<AdminChat />} />
            <Route path="/searching" element={<Searching />} />
            <Route path="/my-bookings" element={<PreviousBookings />} />
            <Route path="/give-ratings" element={<GiveRatings />} />
            <Route
              path="/guest-availability"
              element={<GuestUserAvailability />}
            />
            <Route path="/raise-concern" element={<RaiseConcern />} />
          </Routes>
          <iframe
            style={{
              position: "fixed",
              bottom: "0",
              right: "0",
              border: "none",
              width: "400px",
              height: "600px",
              visibility: isChatVisible ? "visible" : "hidden",
              opacity: isChatVisible ? 1 : 0,
              transition: "visibility 0s, opacity 0.5s linear",
            }}
            src={iframeSrc}
            allow="microphone; geolocation;"
          ></iframe>
          <button
            onClick={toggleChatVisibility}
            style={{
              position: "fixed",
              bottom: "10px",
              right: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "75px",
              height: "75px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaRocketchat
              style={{
                width: "50px",
                height: "50px",
              }}
            />
          </button>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
