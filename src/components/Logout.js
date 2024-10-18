import React, { useEffect } from "react";
import { Container, Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Import axios instance

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call the backend logout API
        await axiosInstance.post("/auth/logout");

        // Clear tokens and user data from local storage
        localStorage.removeItem("spotifyAccessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Log out of Spotify in a new window
        const spotifyLogoutUrl = "https://accounts.spotify.com/logout";
        const logoutWindow = window.open(
          spotifyLogoutUrl,
          "Spotify Logout",
          "width=700,height=500"
        );

        if (logoutWindow) {
          logoutWindow.onload = () => {
            logoutWindow.close();
            navigate("/login");
          };
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        navigate("/login");
      }
    };

    performLogout();
  }, [navigate]);

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1DB954 30%, #191414 90%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: "center", marginBottom: 3 }}>
            <Typography variant="h4" color="secondary" gutterBottom>
              Spotify Client
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You have successfully logged out
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRedirect}
              sx={{
                width: "100%",
                padding: 1,
                backgroundColor: "#1DB954",
                "&:hover": {
                  backgroundColor: "#191414",
                },
              }}
            >
              Go to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Logout;
