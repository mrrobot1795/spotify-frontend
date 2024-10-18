import React from "react";
import { Box } from "@mui/material";
import SongList from "./SongList";
import Player from "./Player";
import QueueSong from "./QueueSong";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const MainLayout = ({
  spotifyConnected,
  currentSong,
  setCurrentSong,
  playNextSong,
  playPreviousSong,
  queue,
  setQueue,
  handlePlaySong,
  handleQueueSong,
}) => {
  const navigate = useNavigate();

  const playFromQueue = (index) => {
    const selectedSong = queue[index];
    setCurrentSong(selectedSong);
    const updatedQueue = queue.filter((_, i) => i !== index);
    setQueue(updatedQueue);
  };

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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 3,
          width: "100%",
          maxWidth: "1200px",
          padding: { xs: 2, md: 4 },
          boxSizing: "border-box",
          marginTop: 4,
        }}
      >
        {/* SongList Component */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: 3,
            padding: { xs: 2, md: 3 },
            minWidth: "280px",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <SongList onPlay={handlePlaySong} onQueue={handleQueueSong} />
        </Box>

        {/* Player Component */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: 3,
            padding: { xs: 2, md: 3 },
            minWidth: "280px",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Player
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            playNext={playNextSong}
            playPrevious={playPreviousSong}
            queue={queue}
            setQueue={setQueue}
          />
        </Box>

        {/* QueueSong Component */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: 3,
            padding: { xs: 2, md: 3 },
            minWidth: "280px",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <QueueSong
            queue={queue}
            setQueue={setQueue}
            playFromQueue={playFromQueue}
            setCurrentSong={setCurrentSong}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
