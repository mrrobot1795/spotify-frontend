import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import PropTypes from "prop-types";

const QueueSong = ({ queue, setQueue, playFromQueue, setCurrentSong }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleRemoveFromQueue = (index) => {
    setSelectedIndex(index);
    setOpenDialog(true);
  };

  const confirmRemove = () => {
    const newQueue = [...queue];
    newQueue.splice(selectedIndex, 1);
    setQueue(newQueue);
    setOpenDialog(false);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newQueue = [...queue];
      [newQueue[index - 1], newQueue[index]] = [
        newQueue[index],
        newQueue[index - 1],
      ];
      setQueue(newQueue);

      if (index === 1) {
        setCurrentSong(newQueue[0]);
      }
    }
  };

  const handleMoveDown = (index) => {
    if (index < queue.length - 1) {
      const newQueue = [...queue];
      [newQueue[index + 1], newQueue[index]] = [
        newQueue[index],
        newQueue[index + 1],
      ];
      setQueue(newQueue);

      if (index === 0) {
        setCurrentSong(newQueue[0]);
      }
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        padding: 2,
        boxShadow: 3,
        borderRadius: 3,
        marginTop: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          Song Queue
        </Typography>

        {queue.length > 0 ? (
          <List>
            {queue.map((song, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 2,
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                  marginBottom: 1,
                  borderRadius: 2,
                }}
              >
                <ListItemText
                  primary={song.name}
                  secondary={`Start: ${song.startTime}s, End: ${song.endTime}s`}
                />
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUpward />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === queue.length - 1}
                  >
                    <ArrowDownward />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => playFromQueue(index)}
                  sx={{ ml: 1 }}
                >
                  Play
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveFromQueue(index)}
                  sx={{ ml: 1 }}
                >
                  Remove
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ textAlign: "center" }}>Queue is empty.</Typography>
        )}

        {/* Dialog to confirm removal */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="confirm-remove-title"
        >
          <DialogTitle id="confirm-remove-title">Remove Song</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to remove this song from the queue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={confirmRemove} color="primary">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

QueueSong.propTypes = {
  queue: PropTypes.array.isRequired,
  setQueue: PropTypes.func.isRequired,
  playFromQueue: PropTypes.func.isRequired,
};

export default QueueSong;
