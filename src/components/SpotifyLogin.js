import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const SpotifyLogin = () => {
  const [error, setError] = useState("");

  const handleConnectSpotify = async () => {
    try {
      const response = await axiosInstance.get("/spotify/login");
      window.location.href = response.data.authorizationUrl;
    } catch (error) {
      console.error("Error connecting to Spotify:", error);
      setError("Failed to connect with Spotify.");
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleConnectSpotify}
        sx={{ mt: 2 }}
      >
        Connect with Spotify
      </Button>
    </Box>
  );
};

export default SpotifyLogin;
