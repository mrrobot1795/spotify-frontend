import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import SpotifyLogin from "./SpotifyLogin";
import Header from "./Header";

const Dashboard = () => {
  const navigate = useNavigate();
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSpotifyConnection = async () => {
      try {
        const response = await axiosInstance.get("/spotify/check-connection");
        setSpotifyConnected(response.data.connected);
        setLoading(false);
      } catch (error) {
        console.error("Error checking Spotify connection:", error);
        setError("Failed to check Spotify connection.");
        setLoading(false);
      }
    };

    checkSpotifyConnection();
  }, []);

  useEffect(() => {
    if (spotifyConnected && !loading) {
      navigate("/");
    }
  }, [spotifyConnected, loading, navigate]);

  const handleLogoutClick = () => {
    navigate("/logout");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #1DB954, #191414)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "64px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Header handleLogout={handleLogoutClick} />
      </Box>

      {/* Main Content */}
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard!
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <>
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </>
        ) : (
          !spotifyConnected && <SpotifyLogin />
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogoutClick}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Container>
    </Box>
  );
};

export default Dashboard;
