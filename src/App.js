import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Logout";
import SpotifyLogin from "./components/SpotifyLogin";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import axiosInstance from "./utils/axiosInstance";

const App = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);

  const handlePlaySong = (song) => {
    setCurrentSong(song);
  };

  const handleQueueSong = (song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
  };

  const playNextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue((prevQueue) => prevQueue.slice(1));
      setCurrentSong(nextSong);
    } else {
      setCurrentSong(null);
    }
  };

  const playPreviousSong = () => {
    // Custom logic for previous song (if needed)
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyAccessTokenFromUrl = urlParams.get("spotifyAccessToken");

    if (spotifyAccessTokenFromUrl) {
      localStorage.setItem("spotifyAccessToken", spotifyAccessTokenFromUrl);
      setSpotifyAccessToken(spotifyAccessTokenFromUrl);
      window.history.replaceState({}, document.title, "/");
    } else {
      const tokenFromLocalStorage = localStorage.getItem("spotifyAccessToken");
      if (tokenFromLocalStorage) {
        setSpotifyAccessToken(tokenFromLocalStorage);
      }
    }
  }, []);

  useEffect(() => {
    const checkSpotifyConnectionOnce = async () => {
      if (!spotifyAccessToken) return;
      try {
        const response = await axiosInstance.get("/spotify/check-connection", {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        });
        setSpotifyConnected(response.data.connected);
      } catch (error) {
        console.error("Error checking Spotify connection:", error);
      }
    };

    if (spotifyAccessToken) {
      checkSpotifyConnectionOnce();
    }
  }, [spotifyAccessToken]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route path="/logout" element={<Logout />} />

          <Route
            path="/spotify-login"
            element={
              <PrivateRoute>
                <SpotifyLogin />
              </PrivateRoute>
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout
                  spotifyConnected={spotifyConnected}
                  currentSong={currentSong}
                  setCurrentSong={setCurrentSong}
                  playNextSong={playNextSong}
                  playPreviousSong={playPreviousSong}
                  queue={queue}
                  setQueue={setQueue}
                  handlePlaySong={handlePlaySong}
                  handleQueueSong={handleQueueSong}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
