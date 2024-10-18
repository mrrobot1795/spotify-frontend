import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1DB954',  // Spotify's green color
    },
    secondary: {
      main: '#191414',  // Spotify's black color
    },
    background: {
      default: '#f4f4f4',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 500,
    },
  },
});

export default theme;
