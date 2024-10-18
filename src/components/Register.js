// src/components/Register.js

import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
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
              Spotify Client - Register
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Create a new account
            </Typography>
          </Box>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& .MuiTextField-root": { marginBottom: 2, width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Name"
              variant="outlined"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1DB954",
                  },
                  "&:hover fieldset": {
                    borderColor: "#191414",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1DB954",
                  },
                },
              }}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1DB954",
                  },
                  "&:hover fieldset": {
                    borderColor: "#191414",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1DB954",
                  },
                },
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1DB954",
                  },
                  "&:hover fieldset": {
                    borderColor: "#191414",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1DB954",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              sx={{
                width: "100%",
                padding: 1,
                marginTop: 2,
                backgroundColor: "#1DB954",
                "&:hover": {
                  backgroundColor: "#191414",
                },
              }}
            >
              Register
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", marginTop: 2 }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "#1DB954", textDecoration: "none" }}
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
