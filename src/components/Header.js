import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import PropTypes from "prop-types";

const Header = ({ handleLogout }) => {
  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, #171419 20%, #112274 80%)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar sx={{ justifyContent: "center", position: "relative" }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center", color: "#ffffff" }}
        >
          Spotify Client
        </Typography>
        <IconButton color="inherit" sx={{ position: "absolute", right: 120 }}>
        </IconButton>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          sx={{
            position: "absolute",
            right: 20,
            borderColor: "#ffffff",
            color: "#ffffff",
            "&:hover": {
              borderColor: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default Header;
