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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
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
              Spotify Client
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Log in to your account
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
              onClick={handleLogin}
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
              Login
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", marginTop: 2 }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#1DB954", textDecoration: "none" }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
