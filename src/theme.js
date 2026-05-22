import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#13552f',
      light: '#1e7d47',
      dark: '#0a3320',
    },
    secondary: {
      main: '#88b536',
    },
    error: {
      main: '#c95643',
    },
    background: {
      default: '#f5f5f0',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  spacing: 8,
});

export default theme;
