import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bfa5',
    },
    secondary: {
      main: '#ffb74d',
    },
    background: {
      default: '#101820',
      paper: '#15202b',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
