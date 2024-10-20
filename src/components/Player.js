import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Slider,
  IconButton,
  Stack,
} from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";
import PropTypes from "prop-types";

const Player = ({
  currentSong,
  setCurrentSong,
  playNext,
  playPrevious,
  queue,
  setQueue,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [currentTrackPosition, setCurrentTrackPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(30);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const token = localStorage.getItem("spotifyAccessToken");
  const endTimeoutRef = useRef(null);
  const lastPlayPositionRef = useRef(0);

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(
      2,
      "0"
    )}`;

  useEffect(() => {
    if (!token) {
      console.error("Spotify token is missing.");
      return;
    }

    const initializeSpotifyPlayer = () => {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const playerInstance = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb) => cb(token),
          volume: 0.8,
        });

        playerInstance.addListener("ready", ({ device_id }) => {
          setDeviceId(device_id);
          setIsReady(true);
        });

        playerInstance.addListener("player_state_changed", (state) => {
          if (!state) return;

          const position = state.position / 1000;
          setCurrentTrackPosition(position);
          setTrackDuration(state.duration / 1000);
          setIsPlaying(!state.paused);

          lastPlayPositionRef.current = position;

          if (position >= (currentSong.endTime || trackDuration)) {
            handlePause();
            playNextSongFromQueue();
          }
        });

        playerInstance.connect();
        setPlayer(playerInstance);
      };
    };

    initializeSpotifyPlayer();

    return () => {
      if (player) player.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (isPlaying && player && deviceId && isReady) {
      const spotifyURI = currentSong.uri;
      const startTime = currentSong.startTime || 0;
      const endTime = currentSong.endTime || trackDuration;

      const positionToPlay =
        lastPlayPositionRef.current > startTime
          ? lastPlayPositionRef.current * 1000
          : startTime * 1000;

      const remainingTime = Math.max(endTime * 1000 - positionToPlay, 0);

      if (endTimeoutRef.current) {
        clearTimeout(endTimeoutRef.current);
      }

      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({
          uris: [spotifyURI],
          position_ms: positionToPlay,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          endTimeoutRef.current = setTimeout(() => {
            handlePause();
            playNextSongFromQueue();
          }, remainingTime);
        })
        .catch((error) => console.error("Error playing song:", error));
    }

    return () => clearTimeout(endTimeoutRef.current);
  }, [isPlaying, currentSong, player, deviceId, isReady]);

  const handlePlayPause = () => {
    if (!player || !isReady || !deviceId) return;

    if (isPlaying) {
      handlePause();
    } else {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setIsPlaying(false);
        clearTimeout(endTimeoutRef.current);
      })
      .catch((error) => console.error("Error pausing the track:", error));
  };

  const handleSliderChange = (_, value) => {
    setCurrentTrackPosition(value);
    lastPlayPositionRef.current = value;

    fetch(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${value * 1000}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).catch((error) => console.error("Error seeking track:", error));
  };

  const playNextSongFromQueue = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue((prevQueue) => prevQueue.slice(1));
      setCurrentSong(nextSong);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "#1c1c1c",
        padding: 4,
        boxShadow: 4,
        borderRadius: 4,
        color: "#fff",
        maxWidth: "650px",
        margin: "auto",
      }}
    >
      <CardContent>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            {currentSong?.name || "No song selected"}
          </Typography>
          <Typography variant="subtitle1" color="white">
            {currentSong?.artists?.map((artist) => artist.name).join(", ") ||
              "Unknown Artist"}
          </Typography>
          <Typography variant="body2" color="white">
            Album: {currentSong?.album?.name || "Unknown Album"}
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            <IconButton color="primary" onClick={playPrevious} sx={{ mx: 2 }}>
              <SkipPrevious fontSize="large" />
            </IconButton>
            <IconButton
              color="primary"
              onClick={handlePlayPause}
              sx={{ mx: 3 }}
            >
              {isPlaying ? (
                <Pause fontSize="large" />
              ) : (
                <PlayArrow fontSize="large" />
              )}
            </IconButton>
            <IconButton color="primary" onClick={playNext} sx={{ mx: 2 }}>
              <SkipNext fontSize="large" />
            </IconButton>
          </Stack>

          <Box sx={{ mt: 4, width: "100%" }}>
            <Typography variant="body1">
              {formatTime(currentTrackPosition)} / {formatTime(trackDuration)}
            </Typography>
            <Slider
              value={currentTrackPosition}
              max={trackDuration}
              onChange={handleSliderChange}
              sx={{
                color: "#1db954",
                height: 8,
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

Player.propTypes = {
  currentSong: PropTypes.object,
  setCurrentSong: PropTypes.func.isRequired,
  playNext: PropTypes.func.isRequired,
  playPrevious: PropTypes.func.isRequired,
  queue: PropTypes.array.isRequired,
  setQueue: PropTypes.func.isRequired,
};

export default Player;
