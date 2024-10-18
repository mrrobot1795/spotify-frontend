import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import PropTypes from "prop-types";

const SongList = ({ onPlay, onQueue }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/spotify/search?q=${encodeURIComponent(searchQuery)}`
      );
      setSongs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error searching tracks:", error);
      setError("Failed to search tracks.");
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const openStartEndDialog = (song, actionType) => {
    setSelectedSong({ ...song, actionType });
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedSong(null);
    setStartTime("");
    setEndTime("");
  };

  const handleDialogSubmit = () => {
    const parsedStartTime = parseInt(startTime);
    const parsedEndTime = parseInt(endTime);

    if (
      isNaN(parsedStartTime) ||
      isNaN(parsedEndTime) ||
      parsedStartTime < 0 ||
      parsedEndTime < 0
    ) {
      alert("Invalid start or end time. Please enter valid numbers.");
      return;
    }

    const songWithTimes = {
      ...selectedSong,
      startTime: parsedStartTime,
      endTime: parsedEndTime,
    };

    if (selectedSong.actionType === "play") {
      onPlay(songWithTimes);
    } else {
      onQueue(songWithTimes);
    }

    closeDialog();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        padding: 2,
        boxShadow: 3,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          Search and Queue Songs
        </Typography>

        <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
          <TextField
            fullWidth
            label="Search for a song"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: "100%" }}
          >
            Search
          </Button>
        </form>

        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {songs.map((song) => (
              <ListItem
                key={song.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 2,
                  backgroundColor: "#f9f9f9",
                  marginBottom: 1,
                  borderRadius: 2,
                }}
              >
                <ListItemText
                  primary={song.name}
                  secondary={song.artists
                    .map((artist) => artist.name)
                    .join(", ")}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openStartEndDialog(song, "play")}
                >
                  Play
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => openStartEndDialog(song, "queue")}
                >
                  Queue
                </Button>
              </ListItem>
            ))}
          </List>
        )}

        {/* Dialog for Start and End Time */}
        <Dialog open={openDialog} onClose={closeDialog}>
          <DialogTitle>Enter Start and End Time</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Specify the start and end time (in seconds) for the song.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Start Time (seconds)"
              fullWidth
              variant="outlined"
              type="number"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextField
              margin="dense"
              label="End Time (seconds)"
              fullWidth
              variant="outlined"
              type="number"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={error}
        />
      </CardContent>
    </Card>
  );
};

SongList.propTypes = {
  onPlay: PropTypes.func.isRequired,
  onQueue: PropTypes.func.isRequired,
};

export default SongList;
